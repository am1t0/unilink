import Notification from "../models/notifications.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";

/**
 * @desc new notification
 * @route POST /api/v1/notification/new
 * @access Private
 */
export const addNotification = asyncHandler( async (req, res) => {

    const { sender, receiver, type } = req.body;

    try {
        const newNotification = new Notification({
            sender,
            receiver,
            type
        });

        await newNotification.save();

        res.status(201).json({
            success: true,
            message: "Notification added successfully",
            newNotification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add notification",
            error: error.message
        });
    }
})

/**
 * @desc get all notification
 * @route GET /api/v1/notification/all
 * @access Private
 */
export const allNotifications = asyncHandler( async (req, res) => {

    const userId = req.user.id;

    try { 
        const notifications = await Notification.find({ receiver: userId , status:"unread"})
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
                message: "You are not authorized to view this notification",
            });
        }
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