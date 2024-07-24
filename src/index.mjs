import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session";
import data from "../demojson/demojson.json" assert { type: "json"};
import jsonParser from "./services/jsonParser.mjs";
import fileRouter from "./controllers/fileController.mjs";

const PORT = 5050;

const app = express();

app.listen(PORT);
console.log(`server is running on ${PORT}`)

//middleware
app.use(session({
    secret: 'update the secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    }
}));
app.use(bodyParser.json());
app.use(fileRouter);

//mongoDB Connection
mongoose.connect('mongodb://localhost:27017/')


app.get("/", (req,res) => {
    console.log(req.session);
    console.log(req.sessionID)
})





