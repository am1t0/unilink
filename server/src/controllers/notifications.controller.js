import Notification from "../models/notifications.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";

/**
 * @desc new notification
 * @route POST /api/v1/notification/new
 * @access Private
 */
export const addNotification = asyncHandler(async (req, res) => {
    const { receiver, type, linkId, postId, commentId, response } = req.body;
    const sender = req.user.id; // Assuming the sender is the authenticated user
  
    try {
      const notificationData = { sender, receiver, type };
  
      // Conditionally include relevant ID based on type
      if (type === "Link") {
        if (!linkId) {
          return res.status(400).json({
            success: false,
            message: "linkId is required for Link notifications",
          });
        }
        notificationData.linkId = linkId;
      } else if (type === "Like" || type === "Mention") {
        if (!postId) {
          return res.status(400).json({
            success: false,
            message: "postId is required for Like or Mention notifications",
          });
        }
        notificationData.postId = postId;
      } else if (type === "Comment") {
        if (!commentId) {
          return res.status(400).json({
            success: false,
            message: "commentId is required for Comment notifications",
          });
        }
        notificationData.commentId = commentId;
      } else if( type== "Response") {
         if(!response) {
            return res.status(400).json({
                success: false,
                message: "response is required for Response notifications",
            });
      }
      notificationData.response = response;
    }
  
      const newNotification = new Notification(notificationData);
      await newNotification.save();
  
      res.status(201).json({
        success: true,
        message: "Notification added successfully",
        newNotification,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to add notification",
        error: error.message,
      });
    }
  });
  

/**
 * @desc get all notification
 * @route GET /api/v1/notification/all
 * @access Private
 */
export const allNotifications = asyncHandler( async (req, res) => {

    const userId = req.user.id;
  
    try { 
        const notifications = await Notification.find({ receiver: userId})
            .populate("sender", "name avatar")
            .sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            message: "Notification added successfully",
            notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch notification",
            error: error.message
        });
    }
})

/**
 * @desc get a notification
 * @route PATCH /api/v1/notification/:notificationId
 * @access Private
 */

export const getNotification = asyncHandler( async (req, res) => {
    const notificationId = req.params.notificationId;
    const userId = req.user.id;
    try {
        const notification = await Notification.findById(notificationId).populate("sender", "name avatar");

        // Check if the notification exists and belongs to the user   
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }
        // Check if the notification belongs to the user
        if (notification.receiver.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this notification",
            });
        }

        // Mark the notification as read
        notification.status = "read";

        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification fetched successfully",
            newNotification: notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch notification",
            error: error.message
        });
    }
})


/**
 * @desc mark notification as read
 * @route PATCH /api/v1/notification/mark-as-read/:notificationId
 * @access Private
 */

export const markAsRead = asyncHandler( async (req, res) => {
    const notificationId = req.params.notificationId;
    const userId = req.user.id;
    try {
        const notification = await Notification.findById(notificationId);   
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }
        if (notification.receiver.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to mark this notification as read",
            });
        }
        notification.status = "read";
        await notification.save();
        res.status(200).json({
            success: true,
            message: "Notification marked as read",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to mark notification as read",
            error: error.message
        });
    }
})