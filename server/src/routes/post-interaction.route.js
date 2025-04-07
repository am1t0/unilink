import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
<<<<<<< HEAD:server/src/routes/post-interaction.router.js
import { addComment, deleteComment, getComments, toggleCommentLike, toggleLike, toggleSave } from "../controllers/post.interaction.controller.js";
=======
import { addComment, deleteComment, getChildComments, getParentComments, toggleLike, toggleSave, updateComment } from "../controllers/post.interaction.controller.js";
>>>>>>> 0f64d3811142c9813acbf2e2e4a4a22c811589b7:server/src/routes/post-interaction.route.js

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

<<<<<<< HEAD:server/src/routes/post-interaction.router.js
/*like a comment*/
router.put("/like-comment/:commentId", protectRoute, toggleCommentLike);
=======
/* update comment */
router.patch("/update/:commentId", protectRoute, updateComment);
>>>>>>> 0f64d3811142c9813acbf2e2e4a4a22c811589b7:server/src/routes/post-interaction.route.js


export default router;