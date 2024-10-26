import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    // ... existing fields
    originalname: String,
    encoding: String,
    mimetype: String,
    size: Number,
    s3Key: String,
    s3Location: String,
    // Add timestamps
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Video = mongoose.model('video', videoSchema);
export default Video;