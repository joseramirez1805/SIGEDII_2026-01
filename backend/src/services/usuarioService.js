import usuarios from "../models/usuariosModel.js";
import customError from "../utils/customError.js";
import { passwordEncoder, comparePassword } from "../utils/passwordEncoder.js";
import { jwtGenerator } from "../utils/JwtGenerator.js";
import { use } from "react";

const registrarUsuario = async (datosUsuario) => {
  const { email, numIdentificacion } = datosUsuario;

  const usuarioExistente = await usuarios.findOne({
    $or: [{ email }, { numIdentificacion }]
  });

  if (usuarioExistente) {
    if (usuarioExistente.email === email) {
      throw new customError("El email ya está registrado.", 409);
    }
    throw new customError("El número de identificación ya está registrado.", 400);
  }
  
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!formatoEmail.test(datosUsuario.email.toString())){
      throw new customError("Formato de correo incorrecto", 400);
  }

  const newContrasena = await passwordEncoder(datosUsuario.contrasena);
  datosUsuario.contrasena = newContrasena;
  datosUsuario.rol = "servidorPublico";
  const usuarioNuevo = new usuarios(datosUsuario);
  return usuarioNuevo.save();
};

const loginUser = async (datosUsuario)=>{
  const {tipoDocumento, numIdentificacion} = datosUsuario;
  const userFound = await usuarios.findOne({
                      tipoDocumento, 
                      numIdentificacion});
  if(userFound == null){
    throw new customError("El usuario no existe o no se encuentra", 401);
  }
  if(!(await comparePassword(datosUsuario.contrasena, userFound.contrasena))){
    throw new customError("La contraseña es incorrecta", 401);
  }

  const jwtString = jwtGenerator(userFound._id, {
                                                  rol: userFound.rol,
                                                  numIdentificacion: userFound.numIdentificacion
                                                },
  );
  return {
  user: {
    rol: userFound.rol,
    nombres: userFound.nombres,
    email: userFound.email
  },
  accessToken: token
  };

}   

export default {
  registrarUsuario, loginUser
};
