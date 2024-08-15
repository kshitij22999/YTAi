import mongoose from "mongoose"

const YTcreds = new mongoose.Schema({
    username: String,
    client_id: String,
    client_secret: String
})

const YTcred = mongoose.model('YTcred',YTcreds);
export default YTcred;