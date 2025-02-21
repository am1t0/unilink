import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { acceptLink, requestLink } from "../controllers/link.controller.js";

const router = Router();

//route for

/* requesting a new link */
router.post("/request/:receiverId", protectRoute, requestLink);

/* accepting link request */
router.patch("/accept/:requestId", protectRoute, acceptLink);



export default router;