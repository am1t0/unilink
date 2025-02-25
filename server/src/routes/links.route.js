import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { acceptLink, getLinks, requestLink } from "../controllers/link.controller.js";

const router = Router();

//route for

/* requesting a new link */
router.post("/request/:receiverId", protectRoute, requestLink);

/* accepting link request */
router.patch("/accept/:requestId", protectRoute, acceptLink);

/* fetching all links */
router.get("/all-links", protectRoute, getLinks);



export default router;