import axios, { isAxiosError } from "axios";
import Event, { TEvent } from "../../models/event.model";
import FacebookToken from "../../models/facebook-token.model";
import {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  PUBLIC_SERVER_URL
} from "../../settings/config";

export interface IFacebookPostResponse {
  id: string;
  postId?: string;
  postUrl: string;
}

export const getFacebookAuthUrl = (): string => {
  const redirectUri = `${PUBLIC_SERVER_URL}/api/v1/admins/facebook/callback`;
  const scopes = [
    "pages_show_list",
    "pages_read_engagement",
    "pages_manage_posts",
    "public_profile"
  ].join(",");

  return `https://www.facebook.com/v24.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code`;
};

export const exchangeCodeForToken = async (code: string): Promise<string> => {
  const redirectUri = `${PUBLIC_SERVER_URL}/api/v1/admins/facebook/callback`;

  try {
    const response = await axios.get(
      "https://graph.facebook.com/v24.0/oauth/access_token",
      {
        params: {
          client_id: FACEBOOK_APP_ID,
          client_secret: FACEBOOK_APP_SECRET,
          redirect_uri: redirectUri,
          code
        }
      }
    );

    const shortLivedToken = response.data.access_token;

    // Exchange for long-lived token
    const longLivedResponse = await axios.get(
      "https://graph.facebook.com/v24.0/oauth/access_token",
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: FACEBOOK_APP_ID,
          client_secret: FACEBOOK_APP_SECRET,
          fb_exchange_token: shortLivedToken
        }
      }
    );

    return longLivedResponse.data.access_token;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        `Facebook Auth Error: ${error.response?.data?.error?.message || error.message}`
      );
    }
    throw error;
  }
};

export interface IFacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
}

export const getManagedPages = async (
  userAccessToken: string
): Promise<IFacebookPage[]> => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v24.0/me/accounts`,
      {
        params: { access_token: userAccessToken }
      }
    );
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        `Failed to fetch pages: ${error.response?.data?.error?.message || error.message}`
      );
    }
    throw error;
  }
};

const generateFacebookPost = (event: TEvent): string => {
  let description = event.description;
  const eventLink = `${PUBLIC_SERVER_URL}/events/view/${event._id}`;
  const hostProfile = `${PUBLIC_SERVER_URL}/profiles/${event.host._id.toString()}`;

  if (description.length > 500) {
    description = `${description.slice(0, 500)}...`;
  }

  let postMessage = `
${event.title}

📍 Location: ${event.placeName}
📅 Date & Time: ${new Date(event.eventDate).toLocaleString()}
💰 Entry Fee: Tk. ${event.entryFee.toFixed(2)}
🛏️ Duration: ${event.dayCount} day(s)${event.nightCount ? ` & ${event.nightCount} night(s)` : ""}

${description}

🔗 Event Link: ${eventLink}
👤 Host Profile: ${hostProfile}
`;

  if (event.itinerary && event.itinerary.length > 0) {
    postMessage += `\n📝 Itinerary:\n`;
    event.itinerary.forEach((item, index) => {
      let itemDesc = item.description || "";
      if (itemDesc.length > 100) {
        itemDesc = `${itemDesc.slice(0, 100)}...`;
      }
      postMessage += `${index + 1}. ${new Date(item.moment).toLocaleString()} ${item.title} - ${itemDesc}\n`;
    });
  }

  return postMessage;
};

/**
 * Exchanges a long-lived user token for a long-lived page token
 */
export const refreshFacebookPageToken = async (
  userAccessToken: string,
  pageId: string
): Promise<string> => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v24.0/me/accounts`,
      {
        params: {
          access_token: userAccessToken
        }
      }
    );

    const pages = response.data.data;
    const targetPage = pages.find((p: any) => p.id === pageId);

    if (!targetPage) {
      throw new Error(
        `Page with ID ${pageId} not found in user's managed pages`
      );
    }

    const newPageToken = targetPage.access_token;

    // Store the new token in DB
    await FacebookToken.create({
      accessToken: newPageToken,
      userAccessToken: userAccessToken,
      pageId: pageId
    });

    return newPageToken;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        `Failed to refresh page token: ${error.response?.data?.error?.message || error.message}`
      );
    }
    throw error;
  }
};

export const postEventToFacebookPage = async (
  eventId: string,
  retryCount = 0
): Promise<IFacebookPostResponse> => {
  const event = await Event.findById(eventId).populate("host");
  if (!event) {
    throw new Error("Event not found");
  }

  if (event.isPostedToFacebook) {
    throw new Error("This event has already been posted to Facebook");
  }

  // Try to get token from DB first
  const tokenDoc = await FacebookToken.findOne().sort({ createdAt: -1 });

  const accessToken = tokenDoc?.accessToken;
  const pageId = tokenDoc?.pageId;
  const userAccessToken = tokenDoc?.userAccessToken;

  if (!accessToken || !pageId) {
    throw new Error(
      "Facebook Page Access Token and Page ID must be configured (either in DB or environment variables)"
    );
  }

  const postMessage = generateFacebookPost(event as any);

  try {
    const response = await axios.post<{ id: string }>(
      `https://graph.facebook.com/v24.0/${pageId}/feed`,
      {
        message: postMessage,
        access_token: accessToken,
        published: true
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const postId = response.data.id;
    // ID format is "{pageId}_{postSegment}" — build a direct URL from it
    const postSegment = postId.split("_")[1];
    const postUrl = postSegment
      ? `https://www.facebook.com/${pageId}/posts/${postSegment}`
      : `https://www.facebook.com/${pageId}`;

    return {
      id: postId,
      postId: postId,
      postUrl
    };
  } catch (error: any) {
    if (isAxiosError(error)) {
      const errorCode = error.response?.data?.error?.code;
      const errorSubcode = error.response?.data?.error?.error_subcode;

      // Token expired error codes: 190 (Access Token Error)
      // Subcodes often indicate specifics like expiration (463, 467)
      const isTokenExpired =
        errorCode === 190 || [463, 467].includes(errorSubcode);

      if (isTokenExpired && userAccessToken && retryCount < 1) {
        try {
          // Attempt to refresh page token using userAccessToken
          await refreshFacebookPageToken(userAccessToken, pageId);
          // Retry posting with new token (it will fetch the new token from DB)
          return postEventToFacebookPage(eventId, retryCount + 1);
        } catch (refreshError) {
          throw new Error(
            `Token expired and refresh failed: ${(refreshError as Error).message}`
          );
        }
      }

      const errorMessage =
        error.response?.data?.error?.message ||
        "Failed to post event to Facebook";

      throw new Error(
        `Facebook API error: ${errorMessage} (Code: ${errorCode})`
      );
    }

    throw new Error(
      `Failed to post event to Facebook: ${(error as Error).message}`
    );
  }
};
