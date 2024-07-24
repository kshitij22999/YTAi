import mongoose from "mongoose"
import bcrypt from "bcryptjs"

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

UserSchema.pre('save', async function(next){
    if(this.isModified || isNew){
        this.password  = await bcrypt.hash(this.password,10);
    }
    next();
})

const User = mongoose.model('User', UserSchema);
export default User;
