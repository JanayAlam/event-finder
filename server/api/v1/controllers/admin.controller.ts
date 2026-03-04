import { NextFunction, Request, Response } from "express";
import AdminUseCase from "../../../libs/use-cases/admin.use-case";

class AdminController {
  static async getStatistics(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminUseCase.getStatistics();
      res.status(200).json(stats);
    } catch (err) {
      next(err);
    }
  }
}

export default AdminController;
