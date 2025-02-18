import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { toggleLike, toggleSave } from "../controllers/post.interaction.controller.js";

const router = Router();

router.put("/save/:postId", protectRoute, toggleSave);

router.put("/like/:postId", protectRoute, toggleLike);


export default router;