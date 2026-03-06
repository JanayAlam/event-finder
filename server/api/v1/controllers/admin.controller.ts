import { NextFunction, Request, Response } from "express";
import { TIdParam } from "../../../../common/types";
import AdminUseCase from "../../../libs/use-cases/admin.use-case";
import ApiError from "../../../utils/api-error.util";
import { convertToObjectId } from "../../../utils/object-id.util";

class AdminController {
  static async getStatistics(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminUseCase.getStatistics();
      res.status(200).json(stats);
    } catch (err) {
      next(err);
    }
  }

  static async getEventList(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search =
        typeof req.query.search === "string" ? req.query.search : undefined;

      const response = await AdminUseCase.eventListForAdmin({
        page,
        limit,
        search
      });

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async blockEvent(
    req: Request<TIdParam>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const eventId = convertToObjectId(req.params.id);
      if (!eventId) {
        throw new ApiError(400, "Invalid event ID");
      }

      const event = await AdminUseCase.blockEvent(eventId);
      if (!event) {
        throw new ApiError(404, "Event not found");
      }

      res.status(200).json({
        message: "Event blocked successfully",
        status: event.status
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPaymentStats(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const stats = await AdminUseCase.getPaymentStats();
      res.status(200).json(stats);
    } catch (err) {
      next(err);
    }
  }

  static async getPaymentList(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const payments = await AdminUseCase.listPaymentsForAdmin({
        page,
        limit
      });

      res.status(200).json(payments);
    } catch (err) {
      next(err);
    }
  }
}

export default AdminController;
