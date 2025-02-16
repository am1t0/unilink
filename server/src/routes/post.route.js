import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createPost, getPost, getAllPosts, deletePost, updatePost } from "../controllers/post.controller.js";

const router = Router();

router.post('/create-post', protectRoute, upload.array('media', 8), createPost);

//route for sepcific post
router.get('/get-post/:postId', protectRoute, getPost);

//route for fetching all post
router.get('/getAll-posts', protectRoute, getAllPosts);

router.patch('/update-post/:postId', protectRoute, updatePost);

router.delete('/delete-post/:postId', protectRoute, deletePost);


export default router;