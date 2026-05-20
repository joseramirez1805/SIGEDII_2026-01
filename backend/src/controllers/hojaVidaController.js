import customError from "../utils/customError.js";
import { obtenerHojaVidaPorUsuario, registroHojaVida, actualizarHojaVida as servicioActualizarHojaVida } from "../services/hojaVidaService.js";

export const crearHojaVida = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      throw new customError("Usuario no autenticado", 401);
    }

    const usuarioId = req.user.userId;

    // Todos los datos vienen en el body como JSON (incluyendo Base64)
    const payload = req.body;

    const hojaVida = await registroHojaVida(usuarioId, payload);

    return res.status(201).json({
      success: true,
      message: "Hoja de vida creada correctamente",
      data: hojaVida,
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerHojaVida = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      throw new customError("Usuario no autenticado", 401);
    }

    const usuarioId = req.user.userId;
    const hojaVida = await obtenerHojaVidaPorUsuario(usuarioId);

    return res.status(200).json({
      success: true,
      message: "Hoja de vida encontrada correctamente",
      data: hojaVida,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarHojaVida = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      throw new customError("Usuario no autenticado", 401);
    }

    const usuarioId = req.user.userId;
    const payload = req.body;

    const hojaActualizada = await servicioActualizarHojaVida(usuarioId, payload);

    return res.status(200).json({
      success: true,
      message: "Hoja de vida actualizada correctamente",
      data: hojaActualizada,
    });
  } catch (error) {
    next(error);
  }
};