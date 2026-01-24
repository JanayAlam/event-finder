import { Router } from "express";
import { USER_ROLE } from "../../../enums";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import FacebookTokenController from "../controllers/facebook-token.controller";

const adminRouter = Router({ mergeParams: true });

// Public callback route for Facebook
adminRouter.get(
  "/facebook/callback",
  FacebookTokenController.handleCallback as any
);

adminRouter.use(authenticate([USER_ROLE.ADMIN]));

adminRouter.get("/facebook-token", FacebookTokenController.getToken as any);
adminRouter.post("/facebook-token", FacebookTokenController.updateToken as any);
adminRouter.delete(
  "/facebook-token",
  FacebookTokenController.disconnect as any
);
adminRouter.get(
  "/facebook/auth-url",
  FacebookTokenController.getAuthUrl as any
);
adminRouter.get(
  "/facebook/pages",
  FacebookTokenController.fetchManagedPages as any
);

export default adminRouter;
