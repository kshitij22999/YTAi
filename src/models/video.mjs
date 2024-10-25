import mongoose from "mongoose";

const videoData = new mongoose.Schema({
    username: String,
    filename: String,
    encoding: String,
    mimetype: String,
})

const Video = mongoose.model('video', videoData);
export default Video;