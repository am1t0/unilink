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
        const { conversationId, text } = req.body;
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
        });

        await newMessage.save();

        // Update the lastMessage field in the conversation
        conversationExist.lastMessage = newMessage._id;
        await conversationExist.save();

        res.status(201).json({
            success: true,
            newMessage, 
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
})