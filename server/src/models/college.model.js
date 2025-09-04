import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        code: {
            type: Number,
            required: true
        },
        regex: {                 // emails regular expression required for college domain validation
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model("College", collegeSchema)