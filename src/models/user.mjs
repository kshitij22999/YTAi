import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    userName: {
        type:mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    displayName: {
        type: mongoose.Schema.Types.String,
    },
    password: {
        type:mongoose.Schema.Types.String,
        required: true,
    }
})

const User = mongoose.model('User', UserSchema);
export default User;
