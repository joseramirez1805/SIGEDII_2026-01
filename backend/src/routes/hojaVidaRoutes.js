import express from "express";
import { crearHojaVida } from "../controllers/hojaVidaController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  // authMiddleware,  // Descomentar cuando se conecte con el frontend
  crearHojaVida
);

export default router;