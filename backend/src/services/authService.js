import { sendEmail } from "../utils/emailSender.js"
import customError from "../utils/customError.js";

const emailService = async (correo, token)=>{
    const to = correo;
    const subject = "TOKEN DE RECUPERACION DE CONTRASEÑA-SIGEPII"
    const html = "<p>Hola, </p>"
            + "<p>Tu token de recuperacion de contraseña es: <strong>" + token + "</strong></p>";
    for(let i = 0; i<3; i++){
        try {
            await sendEmail(to, subject, html);
            return;
        } catch (error) {
            if(i == 3){
                throw new customError("Fallo al intentar enviar token de recuperacion", 502);
                return;
            }
            console.log("Error al enviar el correo, error: " + error.message);
        }
    }
}
export {emailService}