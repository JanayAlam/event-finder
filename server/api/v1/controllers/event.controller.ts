import { NextFunction, Request, Response } from "express";
import { TEventListItemDto } from "../../../../common/types/event.types";
import {
  TCreateEventDto,
  TIdParam,
  TUpdateEventDto
} from "../../../../common/validation-schemas";
import { EVENT_STATUS, PAYMENT_STATUS } from "../../../enums";
import { postEventToFacebookPage } from "../../../libs/external-services/facebook.service";
import FileUploadService from "../../../libs/external-services/file-upload.service";
import {
  initiatePayment,
  validatePayment
} from "../../../libs/external-services/sslcommerz.service";
import EventUseCase from "../../../libs/use-cases/event.use-case";
import FacebookUseCase from "../../../libs/use-cases/facebook.use-case";
import PaymentUseCase from "../../../libs/use-cases/payment.use-case";
import { PUBLIC_SERVER_URL } from "../../../settings/config";
import ApiError from "../../../utils/api-error.util";
import { convertToObjectId } from "../../../utils/object-id.util";

type TEventCreateRequest = Request<any, any, TCreateEventDto>;
type TEventUpdateRequest = Request<TIdParam, any, TUpdateEventDto>;
type TEventIdRequest = Request<TIdParam>;

class EventController {
  static async create(
    req: TEventCreateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthenticated");
      }

      const eventData = {
        ...req.body,
        host: req.user._id,
        members: [req.user._id]
      };

      const event = await EventUseCase.create(eventData as any);

      if (!event) {
        throw new ApiError(500, "Failed to create event");
      }

      res.status(201).json(event);
    } catch (err) {
      next(err);
    }
  }

  static async uploadCoverPhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw new ApiError(400, "No file uploaded");
      }

      const uploaded = await FileUploadService.upload(req.file, "event-cover");
      res.status(200).json({ path: uploaded.path });
    } catch (err) {
      next(err);
    }
  }

  static async uploadAdditionalPhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw new ApiError(400, "No file uploaded");
      }

      const uploaded = await FileUploadService.upload(
        req.file,
        "event-additional-photos"
      );
      res.status(200).json({ path: uploaded.path });
    } catch (err) {
      next(err);
    }
  }

  static async removePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const { path: filePath } = req.body;
      if (!filePath) {
        throw new ApiError(400, "File path is required");
      }

      await FileUploadService.remove(filePath);
      res.status(200).json({ message: "Photo removed successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async update(
    req: TEventUpdateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthenticated");
      }

      const { id } = req.params;

      const event = await EventUseCase.getById(convertToObjectId(id)!);

      if (!event) {
        throw new ApiError(404, "Event not found");
      }

      if (!event.host._id.equals(req.user._id)) {
        throw new ApiError(403, "Only event creator can update event");
      }

      const updatedEvent = await EventUseCase.update(
        convertToObjectId(id)!,
        req.body
      );

      if (!updatedEvent) {
        throw new ApiError(500, "Failed to update event");
      }

      res.status(200).json(updatedEvent);
    } catch (err) {
      next(err);
    }
  }

  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const events = await EventUseCase.getAll({
        projection: {
          title: 1,
          description: 1,
          placeName: 1,
          eventDate: 1,
          entryFee: 1,
          dayCount: 1,
          nightCount: 1,
          memberCapacity: 1,
          host: 1,
          coverPhoto: 1,
          status: 1,
          createdAt: 1
        } as any
      });

      const eventList: TEventListItemDto[] = events.map((event) => ({
        _id: event._id,
        title: event.title,
        placeName: event.placeName,
        eventDate: event.eventDate,
        entryFee: event.entryFee,
        dayCount: event.dayCount,
        nightCount: event.nightCount,
        memberCapacity: event.memberCapacity,
        host: event.host,
        coverPhoto: event.coverPhoto,
        status: event.status
      }));

      res.status(200).json(eventList);
    } catch (err) {
      next(err);
    }
  }

  static async getRecentHosted(
    req: TEventIdRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const events = await EventUseCase.getAll({
        filter: { host: convertToObjectId(id)! },
        projection: {
          title: 1,
          placeName: 1,
          eventDate: 1,
          entryFee: 1,
          dayCount: 1,
          nightCount: 1,
          memberCapacity: 1,
          host: 1,
          coverPhoto: 1,
          status: 1,
          createdAt: 1
        } as any,
        options: { sort: { createdAt: -1 }, limit: 3 }
      });

      const eventList: TEventListItemDto[] = events.map((event) => ({
        _id: event._id,
        title: event.title,
        placeName: event.placeName,
        eventDate: event.eventDate,
        entryFee: event.entryFee,
        dayCount: event.dayCount,
        nightCount: event.nightCount,
        memberCapacity: event.memberCapacity,
        host: event.host,
        coverPhoto: event.coverPhoto,
        status: event.status
      }));

      res.status(200).json(eventList);
    } catch (err) {
      next(err);
    }
  }

  static async getRecentJoined(
    req: TEventIdRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const events = await EventUseCase.getAll({
        filter: { members: convertToObjectId(id)! },
        projection: {
          title: 1,
          placeName: 1,
          eventDate: 1,
          entryFee: 1,
          dayCount: 1,
          nightCount: 1,
          memberCapacity: 1,
          host: 1,
          coverPhoto: 1,
          status: 1,
          createdAt: 1
        } as any,
        options: { sort: { createdAt: -1 }, limit: 3 }
      });

      const eventList: TEventListItemDto[] = events.map((event) => ({
        _id: event._id,
        title: event.title,
        placeName: event.placeName,
        eventDate: event.eventDate,
        entryFee: event.entryFee,
        dayCount: event.dayCount,
        nightCount: event.nightCount,
        memberCapacity: event.memberCapacity,
        host: event.host,
        coverPhoto: event.coverPhoto,
        status: event.status
      }));

      res.status(200).json(eventList);
    } catch (err) {
      next(err);
    }
  }

  static async getAllAdmin(_req: Request, res: Response, next: NextFunction) {
    try {
      const events = await EventUseCase.getAll({});

      res.status(200).json(events);
    } catch (err) {
      next(err);
    }
  }

  static async getSingle(
    req: TEventIdRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const event = await EventUseCase.getById(convertToObjectId(id)!);

      if (!event) {
        throw new ApiError(404, "Event not found");
      }

      res.status(200).json(event);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: TEventIdRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthenticated");
      }

      const { id } = req.params;

      const event = await EventUseCase.getById(convertToObjectId(id)!);

      if (!event) {
        throw new ApiError(404, "Event not found");
      }

      if (!event.host._id.equals(req.user._id)) {
        throw new ApiError(403, "Only event creator can delete event");
      }

      await EventUseCase.delete(convertToObjectId(id)!);

      res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async publishToFacebook(
    req: TEventIdRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      // 1. Check that a Facebook page is connected
      const isConnected = await FacebookUseCase.isPageConnected();
      if (!isConnected) {
        throw new ApiError(400, "Facebook posting coming soon");
      }

      // 2. Fetch the event
      const event = await EventUseCase.getById(convertToObjectId(id)!);

      if (!event) {
        throw new ApiError(404, "Event not found");
      }

      // 3. Ensure the requester is the host
      if (!event.host._id.equals(req.user!._id)) {
        throw new ApiError(
          403,
          "Only event creator can publish event to Facebook"
        );
      }

      // 4. Guard against duplicate posts
      if (event.isPostedToFacebook) {
        throw new ApiError(400, "Event has already been posted to Facebook");
      }

      // 5. Post to Facebook (service handles token refresh internally)
      const facebookPost = await postEventToFacebookPage(id.toString());

      // 6. Persist the result via use-case
      await FacebookUseCase.markEventPosted(
        convertToObjectId(id)!,
        facebookPost.id
      );

      res.status(200).json({
        message: "Event posted to Facebook successfully",
        facebookPostId: facebookPost.id,
        postUrl: facebookPost.postUrl
      });
    } catch (err) {
      next(err);
    }
  }

  static async join(
    req: TEventIdRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const event = await EventUseCase.getById(convertToObjectId(id)!);

      if (!event) {
        throw new ApiError(404, "Event not found");
      }

      if (event.status !== EVENT_STATUS.OPEN) {
        throw new ApiError(
          400,
          `Event is ${event.status}, joining is not allowed.`
        );
      }

      if (new Date(event.eventDate).getTime() < Date.now()) {
        throw new ApiError(400, "Event date has passed");
      }

      if (
        event.members
          .map((member) => member._id.toString())
          .includes(req.user!._id.toString())
      ) {
        throw new ApiError(400, "You have already joined this event");
      }

      if (event.members.length >= (event.memberCapacity || 0)) {
        throw new ApiError(400, "Event is full");
      }

      // If entry fee is 0, join directly
      if (event.entryFee === 0) {
        await EventUseCase.update(convertToObjectId(id)!, {
          $addToSet: { members: req.user!._id }
        });
        res.status(200).json({ message: "Joined event successfully" });
        return;
      }

      // Check for an existing pending payment to avoid duplicates
      const existingPendingPayment =
        await PaymentUseCase.findPendingByUserAndEvent(
          req.user!._id,
          event._id
        );

      const tranId =
        existingPendingPayment?.tranId ??
        `TRAN-${Date.now()}-${req.user!._id.toString().slice(-4)}`;

      const paymentData = {
        total_amount: event.entryFee,
        tran_id: tranId,
        success_url: `${PUBLIC_SERVER_URL}/api/v1/events/${id}/payment/success?tran_id=${tranId}`,
        fail_url: `${PUBLIC_SERVER_URL}/api/v1/events/${id}/payment/fail?tran_id=${tranId}`,
        cancel_url: `${PUBLIC_SERVER_URL}/api/v1/events/${id}/payment/cancel?tran_id=${tranId}`,
        cus_name: req.user!.email,
        cus_email: req.user!.email,
        cus_phone: "01700000000",
        product_name: event.title,
        product_category: "Event"
      };

      const sslResponse = await initiatePayment(paymentData);

      if (sslResponse.status !== "SUCCESS") {
        throw new ApiError(500, "Failed to initiate payment");
      }

      // Only create a new payment record if no pending one exists
      if (!existingPendingPayment) {
        await PaymentUseCase.create({
          user: req.user!._id,
          event: event._id,
          amount: event.entryFee,
          tranId: tranId
        });
      }

      res.status(200).json({ url: sslResponse.GatewayPageURL });
    } catch (err) {
      next(err);
    }
  }

  static async paymentSuccess(
    req: TEventIdRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const tran_id = (req.query.tran_id || req.body.tran_id) as string;
      const val_id = (req.body.val_id || req.query.val_id) as string;

      if (!tran_id || !val_id) {
        throw new ApiError(400, "Missing payment callback data");
      }

      const validation = await validatePayment(val_id);

      if (
        validation.status !== "VALID" &&
        validation.status !== "AUTHENTICATED"
      ) {
        throw new ApiError(400, "Invalid payment validation");
      }

      const existingPayment = await PaymentUseCase.findByTranId(tran_id);

      if (!existingPayment) {
        throw new ApiError(404, "Payment record not found");
      }

      if (existingPayment.status === PAYMENT_STATUS.SUCCESS) {
        res.redirect(`${PUBLIC_SERVER_URL}/events/view/${id}`);
        return;
      }

      // Atomically update payment status and get updated doc
      const updatedPayment = await PaymentUseCase.markSuccess(
        tran_id,
        val_id,
        validation
      );

      if (!updatedPayment) {
        throw new ApiError(500, "Failed to update payment record");
      }

      // Add user to event members
      await EventUseCase.update(existingPayment.event, {
        $addToSet: { members: existingPayment.user }
      });

      res.redirect(`${PUBLIC_SERVER_URL}/events/view/${id}`);
    } catch (err) {
      next(err);
    }
  }

  static async paymentFail(
    req: TEventIdRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const tran_id = (req.query.tran_id || req.body.tran_id) as string;

      if (!tran_id) {
        throw new ApiError(400, "Missing transaction id");
      }

      const updatedPayment = await PaymentUseCase.markFailed(tran_id, req.body);

      const redirectUrl = updatedPayment
        ? `${PUBLIC_SERVER_URL}/events/view/${id}?payment=failed`
        : `${PUBLIC_SERVER_URL}/events/view/${id}`;

      res.redirect(redirectUrl);
    } catch (err) {
      next(err);
    }
  }

  static async paymentCancel(
    req: TEventIdRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const tran_id = (req.query.tran_id || req.body.tran_id) as string;

      const updatedPayment = await PaymentUseCase.markCancelled(
        tran_id,
        req.body
      );

      const redirectUrl = updatedPayment
        ? `${PUBLIC_SERVER_URL}/events/view/${id}?payment=cancelled`
        : `${PUBLIC_SERVER_URL}/events/view/${id}`;

      res.redirect(redirectUrl);
    } catch (err) {
      next(err);
    }
  }

  static async toggleStatus(
    req: TEventIdRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) throw new ApiError(401, "Unauthenticated");

      const { id } = req.params;
      const event = await EventUseCase.getById(convertToObjectId(id)!);

      if (!event) {
        throw new ApiError(404, "Event not found");
      }

      if (!event.host._id.equals(req.user._id)) {
        throw new ApiError(403, "Only event creator can restrict joining");
      }

      const newStatus =
        event.status === EVENT_STATUS.OPEN
          ? EVENT_STATUS.CLOSED
          : EVENT_STATUS.OPEN;
      await EventUseCase.update(convertToObjectId(id)!, {
        status: newStatus
      });

      res.status(200).json({
        message: `Event status changed to ${newStatus}`,
        status: newStatus
      });
    } catch (err) {
      next(err);
    }
  }

  static async toggleBlock(
    req: TEventIdRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const event = await EventUseCase.getById(convertToObjectId(id)!);

      if (!event) throw new ApiError(404, "Event not found");

      const newStatus =
        event.status === EVENT_STATUS.BLOCKED
          ? EVENT_STATUS.OPEN
          : EVENT_STATUS.BLOCKED;
      await EventUseCase.update(convertToObjectId(id)!, {
        status: newStatus
      });

      res
        .status(200)
        .json({ message: `Event is now ${newStatus}`, status: newStatus });
    } catch (err) {
      next(err);
    }
  }
}

export default EventController;
