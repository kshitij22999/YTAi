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

const transcribeService = new pkg.TranscribeService({
    accessKeyId: creds.accessKey,
    secretAccessKey: creds.secret,
    region: process.env.aws_region
});

// Function to perform multipart upload
async function multipartUpload(params) {
    return new Promise((resolve, reject) => {
        const { Body, ...createParams } = params; // Separate Body from other params

        s3.createMultipartUpload(createParams, (err, multipart) => {
            if (err) return reject(err);
            
            const partSize = 5 * 1024 * 1024; // 5MB chunks
            const partCount = Math.ceil(Body.length / partSize);

            let promisesArray = [];

            for (let i = 0; i < partCount; i++) {
                const start = i * partSize;
                const end = Math.min(start + partSize, Body.length);

                promisesArray.push(
                    s3.uploadPart({
                        Body: Body.slice(start, end),
                        Bucket: params.Bucket,
                        Key: params.Key,
                        PartNumber: i + 1,
                        UploadId: multipart.UploadId
                    }).promise()
                );
            }

            Promise.all(promisesArray)
                .then((parts) => {
                    const multipartParams = {
                        Bucket: params.Bucket,
                        Key: params.Key,
                        MultipartUpload: {
                            Parts: parts.map((part, index) => ({
                                ETag: part.ETag,
                                PartNumber: index + 1
                            }))
                        },
                        UploadId: multipart.UploadId
                    };

                    s3.completeMultipartUpload(multipartParams, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                })
                .catch(reject);
        });
    });
}

//endpoint to upload video into s3 bucket
//TODO to implement live video upload status and show progress on ui with a progress bar
//TODO implement multipart upload using promises, s3.createMultipartUpload
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
            
            const s3UploadResult = await multipartUpload(params);
    
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
            error: error.message,
            errorCode: error.code
        });
    }
});

// notification endpoint when job is finished will get called
// work on further processs after job completion
// upadate the url in rules once application is hosted
videoUploadRouter.post('/api/video/transcibe/notification', async (req, res) => {
    const event = req.body;

    if (event.detail.TranscriptionJobStatus === 'COMPLETED') {
        const jobName = event.detail.TranscriptionJobName;
        const bucketName = event.detail.OutputBucketName;
        const fileKey = event.detail.OutputKey;

        // Process further with the job details, e.g., retrieve the SRT file from S3
        console.log(jobName);
        try {
            // Get the transcription job details
            const params = {
                TranscriptionJobName: jobName
            };
            const jobDetails = await transcribeService.getTranscriptionJob(params).promise();

            // Process the job details
            console.log('Transcription job details:', jobDetails);



            res.status(200).json({
                message: 'Transcription job processed successfully',
                jobDetails: jobDetails.TranscriptionJob
            });
        } catch (error) {
            console.error('Error processing transcription job:', error);
            res.status(500).json({
                message: 'Error processing transcription job',
                error: error.message
            });
        }
    } else {
        res.status(200).send('No action needed');
    }
})


export default videoUploadRouter;