import { USER_ROLE } from "../../enums";
import AccountVerification from "../../models/account-verification.model";
import Discussion from "../../models/discussion.model";
import Event from "../../models/event.model";
import PromotionRequest from "../../models/promotion-request.model";
import User from "../../models/user.model";

class AdminUseCase {
  static async getStatistics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      newUsersThisMonth,
      totalHosts,
      totalEvents,
      eventsThisMonth,
      totalDiscussions,
      pendingVerifications,
      pendingPromotions,
      userGrowth,
      eventGrowth,
      popularLocations,
      topHosts
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ role: USER_ROLE.HOST }),
      Event.countDocuments(),
      Event.countDocuments({ eventDate: { $gte: startOfMonth } }),
      Discussion.countDocuments(),
      AccountVerification.countDocuments({ isReviewed: false }),
      PromotionRequest.countDocuments({ isApproved: false }),
      User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      Event.aggregate([
        { $match: { eventDate: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              month: { $month: "$eventDate" },
              year: { $year: "$eventDate" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      Event.aggregate([
        { $group: { _id: "$placeName", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Event.aggregate([
        { $group: { _id: "$host", eventCount: { $sum: 1 } } },
        { $sort: { eventCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        { $unwind: "$userDetails" }
      ])
    ]);

    return {
      totalUsers,
      newUsersThisMonth,
      totalHosts,
      totalEvents,
      eventsThisMonth,
      totalDiscussions,
      pendingVerifications,
      pendingPromotions,
      growth: {
        users: userGrowth,
        events: eventGrowth
      },
      popularLocations,
      topHosts: topHosts.map((h: any) => ({
        id: h._id,
        email: h.userDetails.email,
        eventCount: h.eventCount
      }))
    };
  }
}

export default AdminUseCase;
