import Notification from "../models/notifications.model";
import User from "../models/user.model";


const addNotification = asyncHandler( async (req, res) => {
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
            notification: newNotification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add notification",
            error: error.message
        });
    }
})