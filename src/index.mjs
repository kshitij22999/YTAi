import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import router from "./controllers/router.mjs";
import passport from "passport";
import "./utilities/localStrategy.mjs"
import bodyParser from "body-parser";

const PORT = 5050;

const app = express();

app.listen(PORT);
console.log(`server is running on ${PORT}`)

//middleware
app.use(bodyParser.json());
app.use(session({
    secret: 'update the secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(router);

//mongoDB Connection
mongoose.connect('mongodb://localhost:27017/')


app.get("/", (req,res) => {
    res.send(req.session)
    console.log(req.session);
    console.log(req.sessionID)
})





