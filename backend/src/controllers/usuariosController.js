import { registrarUsuario, loginUser } from "../services/usuarioService.js";

export const crearUsuario = async (req, res) => {
    try {
        const usuarioCreado = await registrarUsuario(req.body);
        return res.status(201).json(usuarioCreado);
    } catch (error) {
        next(error);
        console.log(error.message);
    }
};

export const login = async (req, res) =>{
    try {
        const usuarioLogin = await loginUser();
        return res.status(200).json(usuarioLogin);
    } catch (error) {
        next(error);
        console.log(error.message);
    } 
}
