import { Router } from "express";
import multer from "multer";
import jsonParser from "../services/jsonParser.mjs"

const fileRouter = Router();

const upload = multer({
    storage: multer.memoryStorage()
})

// Endpoint to upload and parse JSON file
fileRouter.post('/upload', upload.single('file'), (req, res) => {
    //res.send(req.file)
    // Process the JSON data here
    const YTcred = jsonParser(JSON.parse(req.file.buffer));
    res.send(YTcred)
});
  
export default fileRouter;