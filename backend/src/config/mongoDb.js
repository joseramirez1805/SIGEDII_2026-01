import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const uriConnection = process.env.MONGO_URI;

export const testConnection = async() =>{
    try{
        console.log("MONGO_URI =", uriConnection);
        await mongoose.connect(uriConnection);
        console.log("Conexion con la base de datos establecida");
        console.log("DB activa =", mongoose.connection.name);
        console.log("Collections activas =", Object.keys(mongoose.connection.collections));
    }catch(error){ 
        console.log("Conexion con la base de datos fallida, error: " + error.message);
    }
}
