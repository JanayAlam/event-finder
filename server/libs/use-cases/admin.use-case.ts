import { Types } from "mongoose";
import {
  TAdminEventListResponseDto,
  TAdminPaymentListResponseDto,
  TAdminPaymentStatsDto
} from "../../../common/types";
import { EVENT_STATUS, PAYMENT_STATUS, USER_ROLE } from "../../enums";
import AccountVerification from "../../models/account-verification.model";
import Discussion from "../../models/discussion.model";
import Event from "../../models/event.model";
import Payment from "../../models/payment.model";
import Profile from "../../models/profile.model";
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

  static async eventListForAdmin(param: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<TAdminEventListResponseDto> {
    const { page, limit, search } = param;
    const skip = (page - 1) * limit;
    const normalizedSearch = search?.trim();

    let query: Record<string, any> = {};

    if (normalizedSearch) {
      const searchRegex = { $regex: normalizedSearch, $options: "i" };
      const [matchingProfiles, matchingUsers] = await Promise.all([
        Profile.find({
          $or: [{ firstName: searchRegex }, { lastName: searchRegex }]
        })
          .select("user")
          .lean<Array<{ user: Types.ObjectId }>>()
          .exec(),
        User.find({ email: searchRegex })
          .select("_id")
          .lean<Array<{ _id: Types.ObjectId }>>()
          .exec()
      ]);

      const hostIds = [
        ...new Set([
          ...matchingProfiles.map((profile) => profile.user.toString()),
          ...matchingUsers.map((user) => user._id.toString())
        ])
      ].map((id) => new Types.ObjectId(id));

      const orFilters: Record<string, any>[] = [
        { title: searchRegex },
        { placeName: searchRegex }
      ];

      if (hostIds.length) {
        orFilters.push({ host: { $in: hostIds } });
      }

      query = { $or: orFilters };
    }

    const [events, total] = await Promise.all([
      Event.find(query)
        .select("title placeName entryFee status createdAt host members")
        .populate({
          path: "host",
          select: "_id email",
          populate: {
            path: "profile",
            select: "_id firstName lastName"
          }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<
          Array<{
            _id: Types.ObjectId;
            title: string;
            placeName: string;
            entryFee: number;
            status?: EVENT_STATUS;
            createdAt: Date;
            host: {
              _id: Types.ObjectId;
              email: string;
              profile?: {
                _id: Types.ObjectId;
                firstName: string;
                lastName: string;
              } | null;
            } | null;
            members: Types.ObjectId[];
          }>
        >()
        .exec(),
      Event.countDocuments(query)
    ]);

    const eventIds = events.map((event) => event._id);

    const payments = eventIds.length
      ? await Payment.find({ event: { $in: eventIds } })
          .select("_id event user amount tranId status createdAt")
          .populate({
            path: "user",
            select: "_id email",
            populate: {
              path: "profile",
              select: "_id firstName lastName"
            }
          })
          .sort({ createdAt: -1 })
          .lean<
            Array<{
              _id: Types.ObjectId;
              event: Types.ObjectId;
              amount: number;
              tranId: string;
              status: PAYMENT_STATUS;
              createdAt: Date;
              user: {
                _id: Types.ObjectId;
                email: string;
                profile?: {
                  _id: Types.ObjectId;
                  firstName: string;
                  lastName: string;
                } | null;
              };
            }>
          >()
          .exec()
      : [];

    const paymentMap = new Map<string, typeof payments>();
    for (const payment of payments) {
      const key = payment.event.toString();
      const eventPayments = paymentMap.get(key) ?? [];
      eventPayments.push(payment);
      paymentMap.set(key, eventPayments);
    }

    const mappedEvents = events.map((event) => {
      const eventPayments = paymentMap.get(event._id.toString()) ?? [];
      const safeEventPayments = eventPayments.filter(
        (payment) => !!payment.user
      );
      const totalCollection = eventPayments.reduce((sum, payment) => {
        return payment.status === PAYMENT_STATUS.SUCCESS
          ? sum + payment.amount
          : sum;
      }, 0);

      return {
        _id: event._id,
        title: event.title,
        placeName: event.placeName,
        entryFee: event.entryFee,
        status: event.status ?? EVENT_STATUS.OPEN,
        createdAt: event.createdAt,
        host: event.host
          ? {
              _id: event.host._id,
              email: event.host.email,
              profile: event.host.profile
                ? {
                    _id: event.host.profile._id,
                    firstName: event.host.profile.firstName,
                    lastName: event.host.profile.lastName
                  }
                : null
            }
          : null,
        memberCount: event.members?.length ?? 0,
        totalCollection,
        payments: safeEventPayments.map((payment) => ({
          _id: payment._id,
          amount: payment.amount,
          tranId: payment.tranId,
          status: payment.status,
          createdAt: payment.createdAt,
          user: {
            _id: payment.user._id,
            email: payment.user.email,
            profile: payment.user.profile
              ? {
                  _id: payment.user.profile._id,
                  firstName: payment.user.profile.firstName,
                  lastName: payment.user.profile.lastName
                }
              : null
          }
        }))
      };
    });

    return {
      events: mappedEvents,
      total,
      page,
      limit
    };
  }

  static async blockEvent(eventId: Types.ObjectId) {
    return Event.findByIdAndUpdate(
      eventId,
      { status: EVENT_STATUS.BLOCKED },
      { new: true }
    )
      .select("_id status")
      .lean<{ _id: Types.ObjectId; status: EVENT_STATUS }>()
      .exec();
  }

  static async getPaymentStats(): Promise<TAdminPaymentStatsDto> {
    const [successfulPayments, failedPayments, collected] = await Promise.all([
      Payment.countDocuments({ status: PAYMENT_STATUS.SUCCESS }),
      Payment.countDocuments({ status: PAYMENT_STATUS.FAILED }),
      Payment.aggregate([
        { $match: { status: PAYMENT_STATUS.SUCCESS } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    return {
      successfulPayments,
      failedPayments,
      totalCollected: collected[0]?.total ?? 0
    };
  }

  static async listPaymentsForAdmin(param: {
    page: number;
    limit: number;
  }): Promise<TAdminPaymentListResponseDto> {
    const { page, limit } = param;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find({})
        .select("amount tranId status createdAt user event")
        .populate({
          path: "user",
          select: "_id email",
          populate: {
            path: "profile",
            select: "_id firstName lastName"
          }
        })
        .populate({
          path: "event",
          select: "_id title"
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<
          Array<{
            _id: Types.ObjectId;
            amount: number;
            tranId: string;
            status: PAYMENT_STATUS;
            createdAt: Date;
            user: {
              _id: Types.ObjectId;
              email: string;
              profile?: {
                _id: Types.ObjectId;
                firstName: string;
                lastName: string;
              } | null;
            } | null;
            event: { _id: Types.ObjectId; title: string } | null;
          }>
        >()
        .exec(),
      Payment.countDocuments({})
    ]);

    return {
      payments: payments
        .filter((payment) => payment.user && payment.event)
        .map((payment) => ({
          _id: payment._id,
          amount: payment.amount,
          tranId: payment.tranId,
          status: payment.status,
          createdAt: payment.createdAt,
          user: {
            _id: payment.user!._id,
            email: payment.user!.email,
            profile: payment.user!.profile
              ? {
                  _id: payment.user!.profile._id,
                  firstName: payment.user!.profile.firstName,
                  lastName: payment.user!.profile.lastName
                }
              : null
          },
          event: {
            _id: payment.event!._id,
            title: payment.event!.title
          }
        })),
      total,
      page,
      limit
    };
  }
}

export default AdminUseCase;
