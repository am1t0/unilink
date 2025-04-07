import {Router} from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { userProfile } from "../controllers/user.controller.js";

const router = Router();

router.get('/:userId', protectRoute, userProfile);

export default router;