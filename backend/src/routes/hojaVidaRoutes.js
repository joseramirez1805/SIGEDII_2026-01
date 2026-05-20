import express from "express";
import { crearHojaVida, obtenerHojaVida } from "../controllers/hojaVidaController.js";
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

export default router;