import { NextFunction, Request, Response } from "express";
import {
  exchangeCodeForToken,
  getFacebookAuthUrl,
  getManagedPages
} from "../../../libs/external-services/facebook.service";
import FacebookUseCase from "../../../libs/use-cases/facebook.use-case";
import { PUBLIC_SERVER_URL } from "../../../settings/config";
import ApiError from "../../../utils/api-error.util";

class FacebookTokenController {
  static async disconnect(_req: Request, res: Response, next: NextFunction) {
    try {
      await FacebookUseCase.disconnect();
      res
        .status(200)
        .json({ message: "Facebook connection removed successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async getToken(_req: Request, res: Response, next: NextFunction) {
    try {
      const token = await FacebookUseCase.getActiveToken();
      if (!token) {
        throw new ApiError(404, "No Facebook token found.");
      }
      res.status(200).json(token);
    } catch (err) {
      next(err);
    }
  }

  static async updateToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, expiresAt, userAccessToken, pageId } = req.body;

      if (!accessToken) {
        throw new ApiError(400, "accessToken is required");
      }

      const newToken = await FacebookUseCase.updateStoreToken({
        accessToken,
        userAccessToken,
        pageId,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined
      });

      res.status(200).json({
        message: "Facebook token updated successfully",
        token: newToken
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAuthUrl(_req: Request, res: Response, next: NextFunction) {
    try {
      const url = getFacebookAuthUrl();
      res.status(200).json({ url });
    } catch (err) {
      next(err);
    }
  }

  static async handleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, error } = req.query;

      if (error) {
        return res.redirect(
          `${PUBLIC_SERVER_URL}/admin/facebook?error=${error}`
        );
      }

      if (!code) {
        return res.redirect(
          `${PUBLIC_SERVER_URL}/admin/facebook?error=no_code`
        );
      }

      const userAccessToken = await exchangeCodeForToken(code as string);

      // Get pages but don't store yet - we'll store the first one or just the user token
      const pages = await getManagedPages(userAccessToken);

      if (pages.length === 0) {
        return res.redirect(
          `${PUBLIC_SERVER_URL}/admin/facebook?error=no_pages`
        );
      }

      // Automatically store the first page for now
      const targetPage = pages[0];

      await FacebookUseCase.saveToken({
        accessToken: targetPage.access_token,
        userAccessToken: userAccessToken,
        pageId: targetPage.id
      });

      res.redirect(`${PUBLIC_SERVER_URL}/admin/facebook?success=true`);
    } catch (err) {
      next(err);
    }
  }

  static async fetchManagedPages(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tokenDoc = await FacebookUseCase.getActiveToken();
      if (!tokenDoc || !tokenDoc.userAccessToken) {
        throw new ApiError(
          400,
          "No user access token found. Please connect Facebook first."
        );
      }

      const pages = await getManagedPages(tokenDoc.userAccessToken);
      res.status(200).json(pages);
    } catch (err) {
      next(err);
    }
  }
}

export default FacebookTokenController;
