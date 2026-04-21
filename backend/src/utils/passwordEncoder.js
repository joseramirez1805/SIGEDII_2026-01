import bcrypt from "bcrypt";
export const passwordEncoder = async (contraseña)=>{
    const saltRounds = 10;
    return await bcrypt.hash(contraseña, saltRounds);
}

export const comparePassword = async (contraseña, contraseñaHashed)=>{
    return await bcrypt.compare(contraseña, contraseñaHashed);
}