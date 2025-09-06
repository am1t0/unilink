import College from "../models/college.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import mongoose from "mongoose";

export const getColleges = asyncHandler(async (req, res) => {
    try {
        const colleges = await College.find();

        res.status(200).json({
            success: true,
            colleges
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
})