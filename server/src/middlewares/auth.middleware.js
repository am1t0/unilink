
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utilities/asyncHandler.js";
import User from "../models/user.model.js";

export const protectRoute = asyncHandler(async (req, res, next) => {
  try {
    
    const token = req.cookies.jwt;
    console.log(token);
    

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

    const currentUser = await User.findById(decoded.id);

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