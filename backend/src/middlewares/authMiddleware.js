import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import customError from "../utils/customError.js";

dotenv.config();
const secretKey = process.env.SECRET_KEY;

const authMiddleware = (req, res, next)=>{
    const header = req.headers.authorization;
    if(!header){
        throw new customError("Peticion invalida, token requerido", 401);
    }
    if(!header.startsWith("Bearer ")){
        throw new customError("Peticion invalida, token requerido", 401);
    }
    const token = header.substring(7);
    try {
        const object = jwt.verify(token, secretKey);
        const {sub, rol, numIdentificacion} = object;
        req.user = {
            userId: sub,
            rol,
            numIdentificacion, 
        }
        next();
    } catch (error) {
        throw new customError("Token invalido", 401);
    }
}

export {authMiddleware};
