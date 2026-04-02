import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.USER_DB,
    process.env.PASSWORD_DB,{ 
        host: "localhost",
        dialect: "mysql"
});
const testConnection = async() =>{
    try{
        await sequelize.authenticate();
        console.log("Conexion con la base de datos establecida");
    }catch(error){
        console.log("Conexion con la base de datos fallida");
    }
}

testConnection();
export {sequelize, testConnection}