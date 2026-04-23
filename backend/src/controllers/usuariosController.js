import { registrarUsuario, loginUser } from "../services/usuarioService.js";

export const crearUsuario = async (req, res, next) => {
    try {
        const usuarioCreado = await registrarUsuario(req.body);
        return res.status(201).json(usuarioCreado);
    } catch (error) {
        next(error);
        console.log(error.message);
    }
};

export const login = async (req, res, next) =>{
    try {
        const usuarioLogin = await loginUser(req.body);
        return res.status(200).json(usuarioLogin);
    } catch (error) {
        next(error);
        console.log(error.message);
    } 
}
