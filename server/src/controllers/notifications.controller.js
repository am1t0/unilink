import mongoose from "mongoose";
import Notification from "../models/notifications.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";

/**
 * @desc new notification
 * @route POST /api/v1/notification/new
 * @access Private
 */
export const addNotification = asyncHandler(async (req, res) => {
  const { receiver, type, linkId, postId, commentId, notificationId } = req.body;
  const sender = req.user.id; // Assuming sender is authenticated user

  try {
    // ✅ Don't notify yourself
    if (sender === receiver) {
      return res.status(200).json({
        success: false,
        message: "Sender and receiver are the same. Notification not created.",
      });
    }

    // ✅ Avoid duplicate notifications
    const existingNotification = await Notification.findOne({
      sender,
      receiver,
      type,
      ...(type === "Link" && linkId && { linkId }),
      ...(type === "Like" && postId && { postId }),
      ...(type === "Mention" && postId && { postId }),
      ...(type === "Comment" && commentId && { commentId }),
    });

    if (existingNotification) {
      return res.status(200).json({
        success: false,
        message: "Notification already exists",
        notificationId: existingNotification._id,
      });
    }

    const notificationData = { sender, receiver, type };

    // ✅ Validate and attach relevant fields based on type
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
    } else if (type === "Link-Accepted") {
      if (!notificationId) {
        return res.status(400).json({
          success: false,
          message: "notificationId is required to update Link-Accepted",
        });
      }

      const requestNotification = await Notification.findById(notificationId);
      if (!requestNotification) {
        return res.status(404).json({
          success: false,
          message: "Original notification not found for Link-Accepted",
        });
      }

      requestNotification.type = "Link-Accepted";
      await requestNotification.save();

      return res.status(200).json({
        success: true,
        message: "Notification type updated to Link-Accepted",
        notificationId: requestNotification._id,
      });
    }

    // ✅ Save new notification
    const newNotification = new Notification(notificationData);
    await newNotification.save();

    res.status(201).json({
      success: true,
      message: "Notification added successfully",
      notificationId: newNotification._id,
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
 * @route GET /api/v1/notification/get
 * @access Private
 */
export const allNotifications = asyncHandler(async (req, res) => {
  const pageSize = parseInt(req.query.pageSize) || 6; // Number of notifications per page
  const cursor = req.query.cursor; // Timestamp of the last notification
  const cursorId = req.query._id; // ID of the last notification
  const userId = req.user.id; // Authenticated user's ID

  const query = { receiver: userId }; // Fetch notifications for the logged-in user

  if (cursor && cursorId && mongoose.Types.ObjectId.isValid(cursorId)) {
    const createdAt = new Date(cursor);

    query.$or = [
      { createdAt: { $lt: createdAt } }, // Notifications created before the cursor
      { createdAt: createdAt, _id: { $lt: cursorId } }, // Handle same-timestamp case
    ];
  }

  try {
    const notifications = await Notification.find(query)
      .populate("sender", "name avatar") // Populate sender details
      .sort({ createdAt: -1, _id: -1 }) // Sort by newest first
      .limit(pageSize + 1) // Fetch one extra document to check for `hasMore`
      .lean();

    const hasMore = notifications.length > pageSize; // Check if there are more notifications
    if (hasMore) notifications.pop(); // Remove the extra document

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications,
      hasMore,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
});


/**
 * @desc get a notification
 * @route PATCH /api/v1/notification/:notificationId
 * @access Private
 */

export const getNotification = asyncHandler(async (req, res) => {
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

export const markAsRead = asyncHandler(async (req, res) => {
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

/**
 * @desc mark all notifications as read
 * @route PATCH /api/v1/notification/mark-all-read
 * @access Private
 */

export const markAllRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  try {
    await Notification.updateMany({ receiver: userId }, { status: "read" });
    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message
    });
  }
})

/**
 * @desc update type of notification
 * @route PATCH /api/v1/notification/:notificationId
 * @access Private
 */

export const updateNotificationType = asyncHandler(async (req, res) => {
    const { notificationId } = req.params; // Extract notificationId from params
    const { type } = req.body; // Extract the status from the request body

    console.log(notificationId, type);
    try {
       if (!type) {
      return res.status(400).json({ message: 'Type is required' });
    }

    // Find the notification by its ID
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
    }

    // Update the notification status
    notification.type = type;

    // Save the updated notification
    await notification.save();

    // Return the updated notification as response
    res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update notification",
            error: error.message
        });
    }
});