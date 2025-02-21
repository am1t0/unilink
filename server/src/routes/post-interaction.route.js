import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getChildComments, getParentComments, toggleLike, toggleSave, updateComment } from "../controllers/post.interaction.controller.js";

const router = Router();

// route for

/* saving-unsaving post by user */
router.put("/save/:postId", protectRoute, toggleSave);

/* like-unliking post */
router.put("/like/:postId", protectRoute, toggleLike);

/* commenting on post */
router.post("/add-comment/:postId", protectRoute, addComment);

/* getting parent comments */
router.get("/parent-comments/:postId", protectRoute, getParentComments);

/* getting child comments */
router.get("/child-comments/:parentId", protectRoute, getChildComments);

/* remove comment */
router.delete("/remove/:commentId", protectRoute, deleteComment);

/* update comment */
router.patch("/update/:commentId", protectRoute, updateComment);


export default router;