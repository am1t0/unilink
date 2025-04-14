import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { sendEmailController } from "../controllers/mail.controller.js";

const router = Router();

//route for

/* sending mail */
router.post("/send", sendEmailController);



export default router;