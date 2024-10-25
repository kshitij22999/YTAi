import { Router } from "express";
import multer from "multer";
import jsonParser from "../services/jsonParser.mjs";
import Video from "../models/video.mjs";
import pkg from "aws-sdk";
import dotenv from "dotenv";

const fileRouter = Router();
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

// Endpoint to upload and parse JSON file
fileRouter.post('/api/upload', upload.single('file'), async (req, res) => {
    // Process the JSON data here
    try{
        const YTcred = jsonParser(JSON.parse(req.file.buffer));
        await YTcred.save();
        res.send(YTcred);
    }
    catch (error) {
        res.status(400).send(error);
    }
});

//endpoint to upload video into s3 bucket
fileRouter.post('/api/video/upload', upload.single('video'), async (req, res) =>{
    try{
        const videoFile = new Video(req.file);
        
        await videoFile.save()
        res.send(videoFile);
        console.log(videoFile);
    }
    catch (error) {
        console.log(error)
    }
});
  
export default fileRouter;