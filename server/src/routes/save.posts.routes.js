import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getSavedPosts, toggleSave } from "../controllers/save.posts.controller.js";


const router = Router();

router.post("/save/:postId", protectRoute, toggleSave);
router.post("/getsavedposts", protectRoute, getSavedPosts);

export default router;