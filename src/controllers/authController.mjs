import { Router } from "express";
import User from '../models/user.mjs';
import { hashPassword, passwordValidator } from "../utilities/helper.mjs";

const authRouter = Router();

authRouter.post("/api/auth", async (request, response) =>{
    const findUser = await User.findOne({ userName: request.body.userName});
    
    //user not present in db
    if (!findUser){ response.status(404).send({ message:"user not found"})};

    //user is present in db
    if(passwordValidator(request.body.password, findUser.password)){
        response.status(200).send(findUser);
    }
});

export default authRouter;