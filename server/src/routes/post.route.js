import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

router.post('/create-post', protectRoute, createPost);

//route for sepcific post
router.get('/get-post/:postId', protectRoute, getPost);

//route for fetching all post
router.get('/getAll-posts', protectRoute, getAllPosts);

router.patch('/update-post/:postId', protectRoute, updatePost);

router.delete('/delete-post/:postId', protectRoute, deletePost);


export default router;