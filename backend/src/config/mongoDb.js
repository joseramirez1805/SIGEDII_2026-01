import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const uriConnection = process.env.MONGO_URI;

export const testConnection = async() =>{
    try{
        await mongoose.connect(uriConnection, );
        console.log("Conexion con la base de datos establecida");
    }catch(error){ 
        console.log("Conexion con la base de datos fallida, error: " + error.message);
    }
}
