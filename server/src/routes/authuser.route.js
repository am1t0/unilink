import { Router } from "express";
import {
    loginUser,
    logout,
    registerUser,
    sendMe,
    updateProfile,
    uploadProfileImage,
    uploadBannerImage,
    getProfile,
    searchRelevantUsers
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logout)

router.put('/profileedit', protectRoute, updateProfile)

router.get("/me", protectRoute, sendMe)

router.post(
    "/upload-profile-image",
    protectRoute,
    upload.single("profileImage"),
    uploadProfileImage
);

router.post(
    "/upload-banner-image",
    protectRoute,
    upload.single("bannerImage"),
    uploadBannerImage
);

router.get("/profile/:profileId", protectRoute, getProfile)

router.get("/search-users", protectRoute, searchRelevantUsers);

export default router;