import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { toggleSave } from "../controllers/post.interaction.controller.js";

const router = Router();

router.put("/save/:postId", protectRoute, toggleSave);


export default router;