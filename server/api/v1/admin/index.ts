import { Router } from "express";
import inputValidator from "../../../middlewares/inputValidator";
import { AdminLoginDTOSchema } from "../../../validationSchemas/admin";
import { adminLogin } from "./controllers/loginController";

const adminRouter = Router();

// admin login [both super and outlet admin]
adminRouter.post("/login", inputValidator(AdminLoginDTOSchema), adminLogin);

export default adminRouter;
