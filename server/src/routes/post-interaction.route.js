import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getComments, toggleCommentLike, toggleLike, toggleSave } from "../controllers/post.interaction.controller.js";

const router = Router();

// route for

/* saving-unsaving post by user */
router.put("/save/:postId", protectRoute, toggleSave);

/* like-unliking post */
router.put("/like/:postId", protectRoute, toggleLike);

/* commenting on post */
router.post("/add-comment/:postId", protectRoute, addComment);

/* getting parent comments */
router.get("/comments/:postId", protectRoute, getComments);

/* remove comment */
router.delete("/remove/:commentId", protectRoute, deleteComment);

/*like a comment*/
router.put("/like-comment/:commentId", protectRoute, toggleCommentLike);


export default router;