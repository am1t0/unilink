import Link from "../models/links.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import mongoose from "mongoose";

/**
 * @desc Send a Link request
 * @route POST /api/v1/links/request/:receiverId
 * @access Private
 */
export const requestLink = asyncHandler(async (req, res) => {
    const { receiverId } = req.params;
    const userId = req.user.id;

    try {
        // Validate receiverId format
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid receiver ID"
            });
        }

        // Check if receiver exists
        const receiverExists = await User.findById(receiverId);
        if (!receiverExists) {
            return res.status(404).json({
                success: false,
                message: "Receiver user not found"
            });
        }

        // Prevent sending a request to self
        if (receiverId === userId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a Link request to yourself"
            });
        }

        // Check if a Link request already exists
        const existingRequest = await Link.findOne({
            $or: [
                { user1: userId, user2: receiverId },
                { user1: receiverId, user2: userId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "Link request already exists"
            });
        }

        // Create a new Link request
        const newRequest = new Link({
            user1: userId,
            user2: receiverId,
            status: "Requested"
        });

        await newRequest.save();

        return res.status(201).json({
            success: true,
            message: "Link request sent",
            request: newRequest
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
        });
    }
});



/**
 * @desc Accept a link request
 * @route POST /api/v1/links/accept/:requestId
 * @access Private
 */
export const acceptLink = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const userId = req.user.id;

    
    try {
        // Validate requestId format
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID"
            });
        }

        // Find the link request
        const linkRequest = await Link.findById(requestId);
        if (!linkRequest) {
            return res.status(404).json({
                success: false,
                message: "link request not found"
            });
        }

        // Ensure the logged-in user is the receiver of the request
        if (linkRequest.user2.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to accept this request"
            });
        }

        // Check if the request is already accepted
        if (linkRequest.status === "Link") {
            return res.status(400).json({
                success: false,
                message: "link request already accepted"
            });
        }

        // Update the request status to 'accepted'
        linkRequest.status = "Link";
        await linkRequest.save();

        return res.status(200).json({
            success: true,
            message: "link request accepted"
        });

    } catch (error) {
        console.error("Error in acceptLink:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
});


/**
 * @desc Fetch all links
 * @route GET /api/v1/links/all-links?status=abc?page=x?limit=y
 * @access Private
 */
export const getLinks = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { status = "Link", limit = 20, page = 1 } = req.query;

    console.log(page);
    try {
        // Convert page and limit to numbers
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        // Find all links where the user is either user1 or user2
        const links = await Link.find({
            $or: [{ user1: userId }, { user2: userId }],
            status: status
        })
        .populate({
            path: "user1",
            select: "name email",
            match: { _id: { $ne: userId } } // Exclude logged-in user's data
        })
        .populate({
            path: "user2",
            select: "name email",
            match: { _id: { $ne: userId } } // Exclude logged-in user's data
        })
        .sort({ createdAt: -1 }) // Sort by most recent
        .skip(limitNumber * (pageNumber - 1))
        .limit(limitNumber);

        return res.status(200).json({
            success: true,
            links
        });

    } catch (error) {
        console.error("Error in getLinks:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
