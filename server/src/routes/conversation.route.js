import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { createConversation } from "../controllers/conversations.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

//route for

/* creating new conversation */
router.post("/new",protectRoute, createConversation);

/* all conversation of a user */
router.get("/all",protectRoute, createConversation);






export default router;