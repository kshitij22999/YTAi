import passport from "passport";
import { Strategy } from "passport-local";
import User from "../models/user.mjs";
import { passwordValidator } from "./hashHelper.mjs";

//add user into session data
passport.serializeUser((user, done)=>{
    done(null,user.id);
});

//find user by id to add into session data
passport.deserializeUser(async (id, done)=>{
    try{
        const findUser = await User.findById(id);
        if(!findUser){ throw new Error("User not found in DB") };
        done(null, findUser);
    }catch(err){
        done(err, null);
} 
})


//find user from db 
export default passport.use(
    new Strategy(async (username,password,done)=>{
        try{
            const findUser = await User.findOne({ username: username});
            console.log(username, password)
            //user not present in db
            if (!findUser){ throw new Error("User not found in DB")};

            if (passwordValidator(password, findUser.password)){
                done(null,findUser);
            }else{
                throw new Error("Invalid password");
            }
        }        
        catch (error){
            done(error, null);
        }

    })  
);