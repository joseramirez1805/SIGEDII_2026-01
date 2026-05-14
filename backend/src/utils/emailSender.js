import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();
const resendKey = process.env.RESEND_KEY;
const resend = new Resend(resendKey);

const sendEmail = async (to, subject, contenido)=>{
    await resend.emails.send({
                    from : "onboarding@resend.dev",
                    to,
                    subject,
                    html: contenido
    });
    return;
}

export {sendEmail}