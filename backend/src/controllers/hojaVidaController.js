import { obtenerHojaVidaPorUsuario, registroHojaVida } from "../services/hojaVidaService.js";

export const crearHojaVida = async (req, res, next) => {
  try {
    // Usuario autenticado desde middleware JWT
    // Temporal para pruebas: reemplazar con un ID real de tu BD
const usuarioId = req.user?.userId || "69de641cb4074992459ab84e";

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
    const usuarioId = req.user?.userId || "69de641cb4074992459ab84e";
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