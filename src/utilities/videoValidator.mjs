import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const validateVideoUpload = (file) => {
    const maxSize = process.env.max_video_size; // 100MB in bytes
    const allowedExtensions = ['.mp4'];

    // Check file size
    if (file.size > maxSize) {
        return { 
            isValid: false, 
            error: 'File size exceeds 100MB limit.' 
        };
    }
    
    // Check file extension
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        return { 
            isValid: false, 
            error: 'Only MP4 files are allowed.' 
        };
    }

    // If all checks pass
    return { 
        isValid: true, 
        error: null 
    };
};