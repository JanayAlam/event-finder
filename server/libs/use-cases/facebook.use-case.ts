import { Types } from "mongoose";
import Event, { TEvent } from "../../models/event.model";
import FacebookToken, {
  TFacebookToken
} from "../../models/facebook-token.model";

class FacebookUseCase {
  static async getActiveToken(): Promise<TFacebookToken | null> {
    return FacebookToken.findOne()
      .sort({ createdAt: -1 })
      .lean<TFacebookToken>()
      .exec();
  }

  static async isPageConnected(): Promise<boolean> {
    const count = await FacebookToken.countDocuments();
    return count > 0;
  }

  static async markEventPosted(
    eventId: Types.ObjectId,
    facebookPostId: string
  ): Promise<TEvent | null> {
    return Event.findByIdAndUpdate(
      eventId,
      { isPostedToFacebook: true, facebookPostId },
      { new: true }
    )
      .lean<TEvent>()
      .exec();
  }

  static async disconnect(): Promise<void> {
    await FacebookToken.deleteMany({});
  }

  static async saveToken(data: {
    accessToken: string;
    userAccessToken: string;
    pageId: string;
  }): Promise<TFacebookToken> {
    const token = await FacebookToken.create(data);
    return token.toObject() as TFacebookToken;
  }

  static async updateStoreToken(data: {
    accessToken: string;
    userAccessToken?: string;
    pageId?: string;
    expiresAt?: Date;
  }): Promise<TFacebookToken> {
    const lastToken = await this.getActiveToken();

    const pageId = data.pageId || lastToken?.pageId;
    const userAccessToken = data.userAccessToken || lastToken?.userAccessToken;

    if (!pageId) {
      throw new Error("pageId is required");
    }

    const token = await FacebookToken.create({
      accessToken: data.accessToken,
      userAccessToken,
      pageId,
      expiresAt: data.expiresAt
    });
    return token.toObject() as TFacebookToken;
  }
}

export default FacebookUseCase;
