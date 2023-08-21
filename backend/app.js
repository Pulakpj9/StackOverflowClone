/* ---------------------------------------- Importing Dependencies ------------------------------------------ */
import express from 'express';
import { config } from "dotenv"
import mongoose from 'mongoose';
import {register,createQuestion,updateQuestion,deleteQuestion,listQuestion} from './controllers/apiCallFunctions.js';
import cookieParser from "cookie-parser";

config({
    path: "./data/config.env"                       // Configuring the server with port number
})

const app = express();                              // creating express app

app.listen(process.env.PORT,()=>{                   // creating server
    console.log("Server is up and running!!");
});

mongoose.connect(process.env.MONGO_URI, {           // connecting with mongo db database
    dbName: process.env.DBNAME,
},)
    .then(() => { console.log("db connected") })
    .catch((e) => { console.log(e) });

app.use(express.json());
app.use(cookieParser());

/* ----------------------------------------------API calls ----------------------------------------------------*/
app.post("/new", register);
app.post("/create-question", createQuestion);
app.post("/update-question", updateQuestion);
app.post("/delete-question", deleteQuestion);
app.get("/list-all-question", listQuestion);