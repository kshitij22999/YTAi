import Video from "../models/video.mjs";
import { Router } from "express";
import pkg from "aws-sdk";
import dotenv from "dotenv";
import multer from "multer";
import { validateVideoUpload } from "../utilities/videoValidator.mjs";
import loginChecker from '../utilities/loginChecker.mjs';

const videoUploadRouter = Router();
dotenv.config();

const upload = multer({
    storage: multer.memoryStorage()
})

const creds = {
    accessKey: process.env.aws_access_key,
    secret: process.env.aws_secret_key,
    bucketName: process.env.bucket_name,
}

const s3 = new pkg.S3({
    accessKeyId: creds.accessKey,
    secretAccessKey: creds.secret
});


//endpoint to upload video into s3 bucket
videoUploadRouter.post('/api/video/upload', upload.single('video'), async (req, res) =>{
    try{
        if (loginChecker(req)){
        const videoFile = new Video({
            ...req.file,
            uploadedAt: new Date()  // Explicitly set upload time (optional)
        });

        // Upload the video to S3
        const isValid = validateVideoUpload(videoFile);
        if(isValid.isValid){
            const params = {
                Bucket: creds.bucketName,
                Key: `videos/${req.user.username}-${Date.now()}-${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            };
    
            const s3UploadResult = await s3.upload(params).promise();
    
            // Save video metadata to database
            videoFile.s3Key = s3UploadResult.Key;
            videoFile.s3Location = s3UploadResult.Location;
            await videoFile.save();
    
            res.status(200).json({
                message: 'Video uploaded successfully',
                videoDetails: videoFile
            });
        }else{
            switch(isValid.error){
                case 'File size exceeds 50MB limit.':
                    res.status(400).json({
                        message: 'file size should be less than 50MB.',
                    });
                    break;
                case 'Only MP4 files are allowed.':
                    res.status(400).json({
                        message: 'Only MP4 files are allowed.',
                    });
                    break;
                default:
                    res.status(400).json({
                        message: 'Unknown error.',
                    });
            }
        }
    }else {
        res.status(401).json({mssg:"please login"});
      } 
    }
    catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({
            message: 'Error uploading video',
            error: error.message
        });
    }
});

export default videoUploadRouter;