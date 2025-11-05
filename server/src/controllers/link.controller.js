import Link from "../models/links.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import mongoose from "mongoose";
import { clearRecommendations, getRecommendations, setRecommendations } from "../utilities/cache.js";

/**
 * @desc Send a Link request
 * @route POST /api/v1/links/request/:receiverId
 * @access Private
 */
export const requestLink = asyncHandler(async (req, res) => {
    
    const { receiverId } = req.params;
    const userId = req.user._id;

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
        
        // clearing cache for new one
        clearRecommendations(userId);
        
        return res.status(201).json({
            success: true,
            message: "Link request sent",
            newRequest
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
 * @route POST /api/v1/links/:linkId
 * @access Private
 */
export const updateLinkStatus = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body; // "Link" or "Ignored" or "Blocked"
    const userId = req.user._id;

    try {
        // Validate requestId format
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID"
            });
        }

        // Validate status
        if (!["Link", "Blocked", "Ignore"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'Link' or 'Ignore' or 'Blocked'"
            });
        }

        // Find the link request
        const linkRequest = await Link.findById(requestId);
        if (!linkRequest) {
            return res.status(404).json({
                success: false,
                message: "Link request not found"
            });
        }

        // Ensure the logged-in user is the receiver of the request
        if (linkRequest.user2.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this request"
            });
        }

        // If the status is already the same, return a message
        if (linkRequest.status === status) {
            return res.status(400).json({
                success: false,
                message: `Link request already marked as '${status}'`
            });
        }

        // Update the request status
        const prevStatus = linkRequest.status;
        linkRequest.status = status;
        await linkRequest.save();

        // Update linksCount for both users if status changes
        if (status === "Link" && prevStatus !== "Link") {
            // Increment linksCount for both users
            await User.updateOne({ _id: linkRequest.user1 }, { $inc: { linksCount: 1 } });
            await User.updateOne({ _id: linkRequest.user2 }, { $inc: { linksCount: 1 } });
        } else if ((status === "Blocked" || status === "Unlink") && prevStatus === "Link") {
            // Decrement linksCount for both users
            await User.updateOne({ _id: linkRequest.user1 }, { $inc: { linksCount: -1 } });
            await User.updateOne({ _id: linkRequest.user2 }, { $inc: { linksCount: -1 } });
        }

        return res.status(200).json({
            success: true,
            message: `Link request successfully updated to '${status}'`
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

/**
 * @desc Fetch paginated links for infinite scroll
 * @route GET /api/v1/links/all-links?status=abc&page=x&limit=y
 * @access Private
 */
export const getLinks = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { status = "Link", limit = 10, page = 1 } = req.query;

    try {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const links = await Link.find({
            $or: [{ user1: userId }, { user2: userId }],
            status
        })
        .populate([
            {
                path: "user1",
                select: "name email avatar",
                match: { _id: { $ne: userId } }
            },
            {
                path: "user2",
                select: "name email avatar",
                match: { _id: { $ne: userId } }
            }
        ])
        .sort({ createdAt: -1 })
        .skip(limitNumber * (pageNumber - 1))
        .limit(limitNumber + 1);

        // Filter out any null users (in case one of the users is the logged-in user)
        const filteredLinks = links.filter(link => { 
            const user1Exists = link.user1 && link.user1._id.toString() !== userId;
            const user2Exists = link.user2 && link.user2._id.toString() !== userId;
            return user1Exists || user2Exists;
        });

        const hasMore = links.length > limitNumber;
        if (hasMore) links.pop();


        return res.status(200).json({
            success: true,
            links,
            hasMore,
            currentPage: pageNumber
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

/**
 * @desc Fetch all links
 * @route GET /api/v1/links/recommendations?page=x?limit=y
 * @access Private
 */
export const getUserRecommendations = async (req, res) => {
  try {
    const currentUser = req.user; // no need for await, req.user is usually already set by middleware
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const loggedInUserId = currentUser._id;

    // ✅ check cache first
    const recommendationsCache = await getRecommendations(loggedInUserId);
    if (recommendationsCache) {
      return res.status(200).json({
        page: 1,
        limit: recommendationsCache.length,
        total: recommendationsCache.length,
        links: recommendationsCache,
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
 
    // ✅ Fetch already linked users (friends, requests, blocked)
    const linkedUsers = await Link.find({
      $or: [{ user1: loggedInUserId }, { user2: loggedInUserId }],
    }).select("user1 user2");

    // Extract linked user IDs
    const linkedUserIds = linkedUsers.map(link =>
      link.user1.equals(loggedInUserId) ? link.user2 : link.user1
    );

    // ✅ Define query: same college, exclude self + linked users
    const query = {
      _id: { $ne: loggedInUserId, $nin: linkedUserIds },
      code: currentUser.code,
    };

    // ✅ Fetch only required fields
    const recommendedUsers = await User.find(query)
      .select("_id name college avatar") // only fetch these fields
      .skip(skip)
      .limit(parseInt(limit));

    // ✅ Store in cache
    await setRecommendations(currentUser._id, recommendedUsers);

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: recommendedUsers.length,
      links: recommendedUsers,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
