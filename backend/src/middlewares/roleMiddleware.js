import customError from "../utils/customError.js";

const roleMiddleware = (rolPermitido) => {
    return (req, res, next) => {
    if (!req.user) {
        throw new customError("No autenticado", 401);
    }
    if (req.user.rol !== rolPermitido) {
        throw new customError("No autorizado", 403);
    }
    next();
}
}
export {roleMiddleware}