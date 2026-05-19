import usuarios from "../models/usuariosModel.js";
import customError from "../utils/customError.js";
import { passwordEncoder, comparePassword } from "../utils/passwordEncoder.js";
import { jwtGenerator } from "../utils/JwtGenerator.js";
import {randomToken} from "../utils/tokenRecuperatePassword.js";
import {emailService} from "./authService.js";
import { tokens } from "../models/tokensModel.js"; 

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

  const jwtString = jwtGenerator(userFound._id.toString(), {
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
  accessToken: jwtString
  };

}  

const recuperarContraseña = async (datosUsuario)=>{
    const {tipoDocumento, numIdentificacion} = datosUsuario;
    const usuarioExistente = await usuarios.findOne({
                                            tipoDocumento,
                                            numIdentificacion                                     
    })
    if(usuarioExistente == null){
        throw new customError("No se encontro al usuario o no existe", 401);
    }else{
        const token = randomToken();
        const tokenBd = new tokens({
                          usuarioId: usuarioExistente._id,
                          numIdentificacionUsuario: usuarioExistente.numIdentificacion,
                          token: token.toString(),
                          fechaCreacion: new Date(),
                          fechaCaducidad: new Date(Date.now() + 5 * 60 * 1000)
        });
        await tokenBd.save();
        await emailService(usuarioExistente.email, token);
        return "Mensaje enviado al correo asociado";
    }
}

const cambioContraseñaJwt = async (userId, contraseña)=>{
    const userFound = await usuarios.findOne({
                                      _id: userId
    });
    if(!userFound){
      throw new customError("No se encontro el usuario", 401);
    }else{
      const constraseñaHashed = await passwordEncoder(contraseña);
      userFound.contrasena = constraseñaHashed;
      await userFound.save();
      return "Cambio de contraseña exitoso, loggeate de nuevo " + userFound.nombres[0];
    }
}

const cambioContraseñaSinJwt = async (datosUsuario)=>{
    const {contraseña, token} = datosUsuario;
    const tokenFound = await tokens.findOne({
                                    token
    });
    if(tokenFound == null){
      throw new customError("No se encontro el token, token incorrecto", 401);
    }
    if(tokenFound.fechaCaducidad < Date.now()){
      throw new customError("Caduco ese token, reintente recuperacion de contraseña", 409);
    }
    const usuarioId = tokenFound.usuarioId;
    const userFound = await usuarios.findById(usuarioId);
    
    if(!userFound){
      throw new customError("No se encontro el usuario", 401);
    }else{
      const constraseñaHashed = await passwordEncoder(contraseña);
      userFound.contrasena = constraseñaHashed;
      await userFound.save();
      return "Cambio de contraseña exitoso, loggeate de nuevo " + userFound.nombres[0];
    }
}

export {
  registrarUsuario, 
  loginUser, 
  recuperarContraseña, 
  cambioContraseñaJwt,
  cambioContraseñaSinJwt
};
