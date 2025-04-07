import jwt from "jsonwebtoken"
import { asyncHandler } from "../utilities/asyncHandler.js";
import User from "../models/user.model.js";

export const protectRoute = asyncHandler(async (req, res, next) => {
  try {
    
    let token = req.cookies.jwt;


     // Check for token in headers if not found in cookies
     if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return res.status(401).json({
            success : false,
            message: "Not Authorized - Invalid token"
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded){
        return res.status(401).json({
            success : false,
            message: "Not Authorized - Invalid token"
        })
    }

    const currentUser = await User.findById(decoded.id).select("-password");

    if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
    }

    req.user = currentUser;

    next();
} catch (error) {
    console.log("Error in Protected Route", error);
    if(error instanceof jwt.JsonWebTokenError){
        return res.status(401).json({
            success : false,
            message: "Not Authorized - Invalid token"
        })
    }else{
        return res.status(500).json({
            success : false,
            message: "Internal Server Error"
        })
    }
}
})