import { registrarUsuario, 
            loginUser, 
            recuperarContraseña, 
            cambioContraseñaJwt,
            cambioContraseñaSinJwt} from "../services/usuarioService.js";

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

export const recuperarContraseñaControlador = async (req, res, next)=>{
    try {
        const usuarioRContraseña = await recuperarContraseña(req.body);
        return res.status(202).json({message: usuarioRContraseña});
    } catch (error) {
        next(error);
        console.log(error.message);
    }
}


export const cambioContraseñaSinJwtControlador = async (req, res, next)=>{
    try {
        const cambio = await cambioContraseñaSinJwt(req.body);
        return res.status(200).json({message: cambio});
    } catch (error) {
        next(error);
        console.log(error.message);
    }
}

export const cambioContraseñaJwtControlador = async (req, res, next)=>{
    try {
        const cambio = await cambioContraseñaJwt(req.user.userId, req.body.contraseña);
        return res.status(200).json({message: cambio});
    } catch (error) {
        next(error);
        console.log(error.message);
    }
}
