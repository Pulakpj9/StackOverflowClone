/* ---------------------------------------- Importing Dependencies ------------------------------------------ */
import express from 'express';
import { config } from "dotenv"
import mongoose from 'mongoose';
import {login,register} from './controllers/apiCallFunctions.js'

config({
    path: "./data/config.env"                       // Configuring the server with port number
})

const app = express();

app.listen(process.env.PORT,()=>{
    console.log("Server is up and running!!");
});

mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DBNAME,
},)
    .then(() => { console.log("db connected") })
    .catch((e) => { console.log(e) });

app.post("/new", register);
app.post("/login", login);
