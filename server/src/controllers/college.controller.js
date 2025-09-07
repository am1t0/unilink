import College from "../models/college.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import mongoose from "mongoose";

/**
 * @desc get list of colleges
 * @route POST /api/v1/college
 * @access Private
 */
export const getColleges = asyncHandler(async (req, res) => {
    try {
        //fetch all colleges list data excluding email regex
        const colleges = await College.find().select('-regex');

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