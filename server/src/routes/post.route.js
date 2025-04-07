import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createPost, getPost, getAllPosts, deletePost, updatePost ,getAllUserPosts} from "../controllers/post.controller.js";

const router = Router();

//route for 

/* creating post */
router.post('/create-post', protectRoute, upload.array('media', 8), createPost);

/* fetch sepcific post */
router.get('/get-post/:postId', protectRoute, getPost);

/* fetch a user's all post */
router.get('/getAll-posts/:userId', protectRoute, getAllUserPosts);

/* fetching all post */
router.get('/getAll-posts', protectRoute, getAllPosts);

/* update posts */
router.patch('/update-post/:postId', protectRoute ,updatePost);

/* delete post */
router.delete('/delete-post/:postId', protectRoute, deletePost);


export default router;