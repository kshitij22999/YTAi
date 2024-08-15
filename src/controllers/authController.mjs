import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.post("/api/auth", passport.authenticate("local") ,(request, response) =>{
    return response.status(200).send({mssg:"worked"})
});

authRouter.post("/api/auth/logout",(request, response)=>{
    if(!request.user){ return response.status(404).send({ mssg: "please login"})};
    request.logout((err)=>{
        if(err){ return response.send({ mssg: "error while loggin out"})}
        response.send({ mssg: "logged out"});
    })
})

export default authRouter;