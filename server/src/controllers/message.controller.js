import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";


/**
 * @desc Message create
 * @route POST /api/v1/message/new
 * @access Private
 */
export const createMessage = asyncHandler(async (req, res) => {
    try {
        const { conversationId, text, receiverId } = req.body;
        const userId = req.user.id;

        // Validate conversationId and text
        if (!conversationId || !text) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversationId or text"
            });
        }

        // Check if conversation exists
        const conversationExist = await Conversation.findById(conversationId);

        if (!conversationExist) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        // Check if user is a member of the conversation
        if (!conversationExist.members.includes(userId)) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Create a new message
        const newMessage = new Message({
            conversationId,
            sender: userId,
            text,
            status: 'sent'
        });

        const savedMessage = await newMessage.save();

        // Update conversation's lastMessage
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: savedMessage._id
        });

        // Return complete message object with _id
        res.status(201).json({
            success: true,
            newMessage: {
                _id: savedMessage._id,
                conversationId: savedMessage.conversationId,
                sender: savedMessage.sender,
                text: savedMessage.text,
                status: savedMessage.status,
                createdAt: savedMessage.createdAt
            }
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
        });
    }
 
} );


/**
 * @desc Message create
 * @route POST /api/v1/message/all/:conversationId
 * @access Private
 */
export const getAllMessage = asyncHandler( async ( req, res) =>{
    try {
        
        const { conversationId } = req.params;
        const userId = req.user.id;

        const conversationExist = await Conversation.findById(conversationId);

        //conversation not found
        if (!conversationExist) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        // Check if user is a member of the conversation
        if (!conversationExist.members.includes(userId)) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const messages = await Message.find({ conversationId });

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
        });
    }
});


/**
 * @desc Update message status
 * @route PATCH /api/v1/message/status/:messageId
 * @access Private
 */
export const updateMessageStatus = asyncHandler(async (req, res) => {
    try {
        const { messageId } = req.params;
        const { status } = req.body;

        const message = await Message.findByIdAndUpdate(
            messageId,
            { status },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        res.status(200).json({
            success: true,
            message
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});