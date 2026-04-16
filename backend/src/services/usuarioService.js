import usuarios from "../models/usuariosModel.js";
import customError from "../utils/customError.js";
import { passwordEncoder } from "../utils/passwordEncoder.js";

export const registrarUsuario = async (datosUsuario) => {
  const { email, numIdentificacion } = datosUsuario;

  const usuarioExistente = await usuarios.findOne({
    $or: [{ email }, { numIdentificacion }]
  });

  if (usuarioExistente) {
    if (usuarioExistente.email === email) {
      throw new customError("El email ya está registrado.", 400);
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

export default {
  registrarUsuario
};
