import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const jwtGenerator = (userId, payload)=>{
    return jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
            expiresIn: "1h",
            subject: userId,
            issuer: "SIGEDII_2026_BAKCEND"
        }
    );
}