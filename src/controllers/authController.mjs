import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.post("/api/auth", passport.authenticate("local") ,(request, response) =>{
    response.send({mssg:"worked"})
});

export default authRouter;