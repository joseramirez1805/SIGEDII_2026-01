import express from "express";
import {testConnection} from "./config/mongoDb.js"
import dotenv from "dotenv"

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(express.json());

const serverConnection = async ()=>{
    try {
        await testConnection();
        app.listen(port, ()=>{
            console.log("Corriendo en puerto " +  port);
        });
    } catch (error) {
        console.log("Error al levantar el servidor, error: " + error.message);
    }
}
    
serverConnection();

