import { registrarUsuario } from "../services/usuarioService.js";

export const crearUsuario = async (req, res) => {
  try {
    const usuarioCreado = await registrarUsuario(req.body);
    return res.status(201).json(usuarioCreado);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
