import usuarios from "../models/usuariosModel.js";

export const registrarUsuario = async (datosUsuario) => {
  const { email, numIdentificacion } = datosUsuario;

  const usuarioExistente = await usuarios.findOne({
    $or: [{ email }, { numIdentificacion }]
  });

  if (usuarioExistente) {
    if (usuarioExistente.email === email) {
      throw new Error("El email ya está registrado.");
    }
    throw new Error("El número de identificación ya está registrado.");
  }

  datosUsuario.rol = "servidorPublico";
  const usuarioNuevo = new usuarios(datosUsuario);
  return usuarioNuevo.save();
};

export default {
  registrarUsuario
};
