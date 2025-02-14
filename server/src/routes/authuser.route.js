import { Router } from "express";
import { loginUser, registerUser, sendMe, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser)

router.post("/login", loginUser)

router.put('/profileedit', protectRoute, updateProfile)

router.get("/me", protectRoute, sendMe)

export default router;