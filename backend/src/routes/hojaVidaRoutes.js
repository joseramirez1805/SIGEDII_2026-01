import express from "express";
import { crearHojaVida, obtenerHojaVida, actualizarHojaVida } from "../controllers/hojaVidaController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  crearHojaVida
);

router.get(
  "/",
  authMiddleware,
  obtenerHojaVida
);

router.put(
  "/",
  authMiddleware,
  actualizarHojaVida
);

export default router;