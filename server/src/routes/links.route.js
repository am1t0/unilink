import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { updateLinkStatus, getLinks, getUserRecommendations, requestLink } from "../controllers/link.controller.js";

const router = Router();

//route for

/* requesting a new link */
router.post("/request/:receiverId", protectRoute, requestLink);

/* accepting link request */
router.patch("/:requestId", protectRoute, updateLinkStatus);

/* fetching all links */
router.get("/all-links", protectRoute, getLinks);

/* fetching recommendation links */
router.get("/recommendations", protectRoute, getUserRecommendations);


export default router;