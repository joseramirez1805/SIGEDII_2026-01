import express from "express";
import { crearUsuario } from "../controllers/usuariosController.js";

const router = express.Router();

router.post("/registrarUsuario", crearUsuario);

export default router;
