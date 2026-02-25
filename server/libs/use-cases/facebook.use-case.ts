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
}

export default FacebookUseCase;
