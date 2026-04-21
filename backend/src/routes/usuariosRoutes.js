import express from "express";
import { crearUsuario, login } from "../controllers/usuariosController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/registrarUsuario", authMiddleware, roleMiddleware("jefeTalentoHumano"), crearUsuario);
router.post("/login", login);
export default router;
