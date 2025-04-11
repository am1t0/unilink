import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { addNotification, getNotification, allNotifications } from "../controllers/notifications.controller.js";


const router = Router();

//route for

/* sending new message */
router.post("/new", protectRoute, addNotification);

/* getting all notifications */
router.get("/all", protectRoute, allNotifications)

/* getting a particular notification */
router.get("/:notificationId", protectRoute, getNotification)


export default router;