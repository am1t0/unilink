import { Router } from "express";
import { createMessage, getAllMessage, updateMessageStatus } from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

//route for

/* sending new message */
router.post("/new", protectRoute, createMessage);

/* all messages of a conversation */
router.get("/all/:conversationId", protectRoute, getAllMessage);

/* update message status */
router.patch("/status/:messageId", protectRoute, updateMessageStatus);

export default router;
