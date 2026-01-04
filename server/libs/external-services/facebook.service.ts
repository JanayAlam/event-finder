import axios, { isAxiosError } from "axios";
import { TEvent } from "../../models/event.model";
import {
  FACEBOOK_PAGE_ACCESS_TOKEN,
  FACEBOOK_PAGE_ID,
  PUBLIC_SERVER_URL
} from "../../settings/config";

export interface IFacebookPostResponse {
  id: string;
  postId?: string;
}

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

export const postEventToFacebookPage = async (
  event: TEvent
): Promise<IFacebookPostResponse> => {
  if (!FACEBOOK_PAGE_ACCESS_TOKEN || !FACEBOOK_PAGE_ID) {
    throw new Error(
      "Facebook Page Access Token and Page ID must be configured in environment variables"
    );
  }

  const postMessage = generateFacebookPost(event);

  try {
    const response = await axios.post<{ id: string }>(
      `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/feed`,
      {
        message: postMessage,
        access_token: FACEBOOK_PAGE_ACCESS_TOKEN
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return {
      id: response.data.id,
      postId: response.data.id
    };
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "Failed to post event to Facebook";
      const errorCode = error.response?.data?.error?.code || 500;

      throw new Error(
        `Facebook API error: ${errorMessage} (Code: ${errorCode})`
      );
    }

    throw new Error(
      `Failed to post event to Facebook: ${(error as Error).message}`
    );
  }
};
