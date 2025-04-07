import Conversation from "../models/conversation.model.js"
import User from "../models/user.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import mongoose from "mongoose";

/**
 * @desc Conversation create
 * @route POST /api/v1/conversation/new
 * @access Private
 */
export const createConversation = asyncHandler(async (req, res) => {
    try {

        const { members } = req.body;
        const userId = req.user.id;
    
        // Validate members format
        if (!members || members.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Invalid members format"
            });
        }
    
        // Check if members exist
        const membersExist = await User.find({
            _id: { $in: members }
        });
    
        if (membersExist.length !== members.length) {
            return res.status(404).json({
                success: false,
                message: "One or more members not found"
            });
        }
    
        // Create a new conversation
        const newConversation = new Conversation({
            members,
            lastMessage: null,
        });
    
        await newConversation.save();
    
        res.status(201).json({
            success: true,
            data: newConversation
        });
        
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
        });
    }
 
} );



/**
 * @desc Conversation get
 * @route GET /api/v1/conversations/all
 * @access Private
 */
export const getConversations = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await Conversation.find({ 
              members: { $in: [userId] } })
             .populate("members", "name email avatar")
             .populate("lastMessage", "text createdAt")

        res.status(200).json({
            success: true,
            conversations
        });
        
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
        });
    }
} );