import express from "express";
import { crearUsuario, 
            login, 
            recuperarContraseñaControlador, 
            cambioContraseñaJwtControlador,
            cambioContraseñaSinJwtControlador} from "../controllers/usuariosController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/registrarUsuario", authMiddleware, roleMiddleware("jefeTalentoHumano"), crearUsuario);
router.post("/login", login);
router.post("/recuperarContrasena", recuperarContraseñaControlador);
router.put("/cambioContrasena-protegido", authMiddleware, cambioContraseñaJwtControlador);
router.put("/cambioContrasena", cambioContraseñaSinJwtControlador);

export default router;
