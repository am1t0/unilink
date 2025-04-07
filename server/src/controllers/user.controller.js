import User from "../models/user.model.js";

export const userProfile = async (req, res) => {
    const{userId} = req.params;
    try {
        //fetch user by it's id
        let user = await User.findById(userId).select('-password');

        //user not exists
        if (!user) {    
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error("Error in userProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}