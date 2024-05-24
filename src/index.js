// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})

const ports = process.env.PORT || 8000 

connectDB().then(()=>{
    app.listen(ports , ()=>{
        console.log(`Server connected at ${ports}`);
    })
}).catch((error)=>{
    console.log("MONGO db connection error",error);
})