import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getColleges } from "../controllers/college.controller.js";

const router = Router();

// routes for 

/* fetch all colleges list */
router.get('/',  getColleges);

export default router;``