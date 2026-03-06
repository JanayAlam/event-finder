import { Router } from "express";
import { IdParamsSchema } from "../../../../common/validation-schemas";
import { USER_ROLE } from "../../../enums";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import AdminController from "../controllers/admin.controller";
import FacebookTokenController from "../controllers/facebook-token.controller";

const adminRouter = Router({ mergeParams: true });

// Public callback route for Facebook
adminRouter.get("/facebook/callback", FacebookTokenController.handleCallback);

adminRouter.use(authenticate([USER_ROLE.ADMIN]));

adminRouter.get("/statistics", AdminController.getStatistics);
adminRouter.get("/events", AdminController.getEventList);
adminRouter.patch(
  "/events/:id/block",
  inputValidator(null, IdParamsSchema),
  AdminController.blockEvent
);
adminRouter.get("/facebook-token", FacebookTokenController.getToken);
adminRouter.post("/facebook-token", FacebookTokenController.updateToken);
adminRouter.delete("/facebook-token", FacebookTokenController.disconnect);
adminRouter.get("/facebook/auth-url", FacebookTokenController.getAuthUrl);
adminRouter.get("/facebook/pages", FacebookTokenController.fetchManagedPages);

export default adminRouter;
