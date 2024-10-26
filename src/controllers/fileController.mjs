import { Router } from "express";
import multer from "multer";
import jsonParser from "../services/jsonParser.mjs";
import dotenv from "dotenv";


const fileRouter = Router();
dotenv.config();

const upload = multer({
    storage: multer.memoryStorage()
})

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


  
export default fileRouter;