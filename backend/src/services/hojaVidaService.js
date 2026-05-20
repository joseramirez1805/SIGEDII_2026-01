import HojaVida from "../models/hojaVidaModel.js";
import Usuario from "../models/usuariosModel.js";
import customError from "../utils/customError.js";

/**
 * Validar que un string Base64 sea PDF o JPG y no supere 2MB
 * El frontend envía: "data:application/pdf;base64,XXXXXX..."
 */
const validarBase64 = (base64, nombreCampo) => {
  if (!base64 || typeof base64 !== "string") {
    throw new customError(`${nombreCampo}: el soporte es obligatorio`, 400);
  }

  // Verificar que tenga formato base64 válido con encabezado
  if (!base64.startsWith("data:")) {
    throw new customError(
      `${nombreCampo}: formato Base64 inválido. Debe iniciar con 'data:...'`,
      400
    );
  }

  // Extraer el tipo MIME
  const mimeMatch = base64.match(/^data:([^;]+);base64,/);
  if (!mimeMatch) {
    throw new customError(`${nombreCampo}: no se pudo leer el tipo de archivo`, 400);
  }

  const mimeType = mimeMatch[1];
  const mimesPermitidos = ["application/pdf", "image/jpeg"];

  if (!mimesPermitidos.includes(mimeType)) {
    throw new customError(
      `${nombreCampo}: solo se permiten archivos PDF o JPG`,
      400
    );
  }

  // Calcular tamaño aproximado del archivo en bytes
  // Base64 usa ~4/3 del tamaño original
  const base64Data = base64.split(",")[1];
  const tamanoBytes = Math.ceil((base64Data.length * 3) / 4);
  const maxBytes = 2 * 1024 * 1024; // 2MB

  if (tamanoBytes > maxBytes) {
    const tamanoMB = (tamanoBytes / (1024 * 1024)).toFixed(2);
    throw new customError(
      `${nombreCampo}: el archivo excede el límite de 2MB. Tamaño actual: ${tamanoMB}MB`,
      400
    );
  }
};

/**
 * Validar datos personales (HU-006, HU-007)
 */
const validarDatosPersonales = (datosPersonales) => {
  if (!datosPersonales) {
    throw new customError("Datos personales son requeridos", 400);
  }

  const { apellidos, fechaNacimiento, genero, datosContacto } = datosPersonales;

  if (!apellidos || !Array.isArray(apellidos) || apellidos.length === 0) {
    throw new customError("Apellidos son requeridos (debe ser un array)", 400);
  }

  if (!fechaNacimiento) {
    throw new customError("Fecha de nacimiento es requerida", 400);
  }

  if (!genero) {
    throw new customError("Género es requerido", 400);
  }

  if (!datosContacto) {
    throw new customError("Datos de contacto son requeridos", 400);
  }

  const { telefono, direccionResidencia, tipoResidencia, complementoDireccionEspecial } =
    datosContacto;

  if (!telefono) {
    throw new customError("Teléfono es requerido", 400);
  }

  if (!direccionResidencia) {
    throw new customError("Dirección de residencia es requerida", 400);
  }

  // HU-007: Si es RURAL, complementoDireccionEspecial es obligatorio
  if (tipoResidencia === "RURAL" && !complementoDireccionEspecial) {
    throw new customError(
      "Para residencia Rural, el campo 'complementoDireccionEspecial' es obligatorio",
      400
    );
  }
};

/**
 * Validar formación académica (HU-008)
 */
const validarFormacionAcademica = (formacionAcademica) => {
  if (!formacionAcademica || formacionAcademica.length === 0) {
    throw new customError(
      "Formación académica es obligatoria. Debe incluir al menos 1 registro",
      400
    );
  }

  if (!Array.isArray(formacionAcademica)) {
    throw new customError("Formación académica debe ser un array", 400);
  }

  formacionAcademica.forEach((formacion, index) => {
    const num = index + 1;

    if (!formacion.nivelAcademico) {
      throw new customError(`Formación ${num}: nivelAcademico es requerido`, 400);
    }

    if (!["pregrado", "postgrado"].includes(formacion.nivelAcademico)) {
      throw new customError(
        `Formación ${num}: nivelAcademico debe ser 'pregrado' o 'postgrado'`,
        400
      );
    }

    if (!formacion.nivelFormacion) {
      throw new customError(`Formación ${num}: nivelFormacion es requerida`, 400);
    }

    if (!["doctorado", "maestria"].includes(formacion.nivelFormacion)) {
      throw new customError(
        `Formación ${num}: nivelFormacion debe ser 'doctorado' o 'maestria'`,
        400
      );
    }

    const camposRequeridos = [
      "areaConocimiento",
      "pais",
      "institucion",
      "programaAcademico",
      "tituloObtenido",
      "semestresAprobados",
      "estadoEstudio",
      "fechaTerminacionMaterias",
      "fechaGrado",
    ];

    for (const campo of camposRequeridos) {
      if (!formacion[campo]) {
        throw new customError(`Formación ${num}: ${campo} es requerido`, 400);
      }
    }

    if (!["finalizado", "enProceso"].includes(formacion.estadoEstudio)) {
      throw new customError(
        `Formación ${num}: estadoEstudio debe ser 'finalizado' o 'enProceso'`,
        400
      );
    }

    // Validar soporte Base64 obligatorio
    validarBase64(formacion.soporteBase64, `Formación académica ${num} - soporte`);
  });
};

/**
 * Validar experiencia laboral (HU-009)
 */
const validarExperienciaLaboral = (experienciaLaboral) => {
  if (!experienciaLaboral || experienciaLaboral.length === 0) {
    throw new customError(
      "Experiencia laboral es obligatoria. Debe incluir al menos 1 registro",
      400
    );
  }

  if (!Array.isArray(experienciaLaboral)) {
    throw new customError("Experiencia laboral debe ser un array", 400);
  }

  experienciaLaboral.forEach((experiencia, index) => {
    const num = index + 1;

    if (!experiencia.tipoInstitucion) {
      throw new customError(`Experiencia ${num}: tipoInstitucion es requerida`, 400);
    }

    if (!["publico", "privado"].includes(experiencia.tipoInstitucion)) {
      throw new customError(
        `Experiencia ${num}: tipoInstitucion debe ser 'publico' o 'privado'`,
        400
      );
    }

    if (!experiencia.nombreInstitucion) {
      throw new customError(`Experiencia ${num}: nombreInstitucion es requerida`, 400);
    }

    if (!experiencia.cargo) {
      throw new customError(`Experiencia ${num}: cargo es requerido`, 400);
    }

    if (!experiencia.fechaIngreso || !experiencia.fechaTerminacion) {
      throw new customError(
        `Experiencia ${num}: fechaIngreso y fechaTerminacion son requeridas`,
        400
      );
    }

    if (
      !experiencia.jornadaLaboral ||
      !["completa", "parcial"].includes(experiencia.jornadaLaboral)
    ) {
      throw new customError(
        `Experiencia ${num}: jornadaLaboral debe ser 'completa' o 'parcial'`,
        400
      );
    }

    if (!experiencia.motivoRetiro) {
      throw new customError(`Experiencia ${num}: motivoRetiro es requerido`, 400);
    }

    if (!experiencia.ubicacion) {
      throw new customError(`Experiencia ${num}: ubicación es requerida`, 400);
    }

    const { ciudad, pais, departamento, tipoZona, direccion } = experiencia.ubicacion;

    if (!ciudad || !pais || !departamento || !tipoZona || !direccion) {
      throw new customError(
        `Experiencia ${num}: todos los campos de ubicación son requeridos (ciudad, pais, departamento, tipoZona, direccion)`,
        400
      );
    }

    if (!["RURAL", "URBANA"].includes(tipoZona)) {
      throw new customError(
        `Experiencia ${num}: tipoZona debe ser 'RURAL' o 'URBANA'`,
        400
      );
    }

    // Validar soporte Base64 obligatorio
    validarBase64(experiencia.soporteBase64, `Experiencia laboral ${num} - soporte`);
  });
};

/**
 * Validar permisos para Gerencia Pública (HU-010)
 */
const validarPermisoGerenciaPublica = async (usuarioId) => {
  const usuario = await Usuario.findById(usuarioId);

  if (!usuario) {
    throw new customError("Usuario no encontrado", 404);
  }

  if (usuario.rol !== "servidorPublico") {
    throw new customError(
      "Solo Servidores Públicos pueden registrar información de Gerencia Pública",
      403
    );
  }

  return usuario;
};

/**
 * Registrar hoja de vida completa (HU-006 a HU-013)
 * 
 * Recibe TODO como JSON en el body (incluyendo soportes en Base64).

 *
 * @param {String} usuarioId - ID del usuario autenticado
 * @param {Object} payload - Datos completos de la hoja de vida con soportes incluidos
 * @returns {Object} - Documento de hoja de vida creado
 */
export const registroHojaVida = async (usuarioId, payload) => {
  try {
    const { datosPersonales, formacionAcademica, experienciaLaboral, gerenciaPublica } =
      payload;

    // ============================================
    // 1. VALIDAR SECCIONES OBLIGATORIAS PRESENTES
    // ============================================
    if (!datosPersonales) {
      throw new customError("Datos personales son requeridos", 400);
    }

    if (!formacionAcademica || !Array.isArray(formacionAcademica) || formacionAcademica.length === 0) {
      throw new customError(
        "Formación académica es obligatoria. Debe incluir al menos 1 registro",
        400
      );
    }

    if (!experienciaLaboral || !Array.isArray(experienciaLaboral) || experienciaLaboral.length === 0) {
      throw new customError(
        "Experiencia laboral es obligatoria. Debe incluir al menos 1 registro",
        400
      );
    }
    validarDatosPersonales(datosPersonales);
    validarFormacionAcademica(formacionAcademica);
    validarExperienciaLaboral(experienciaLaboral);
    if (gerenciaPublica) {
      await validarPermisoGerenciaPublica(usuarioId);

      if (typeof gerenciaPublica !== "object" || Object.keys(gerenciaPublica).length === 0) {
        throw new customError(
          "Gerencia Pública, si se envía, debe contener datos válidos",
          400
        );
      }
    }

    // VERIFICAR QUE NO EXISTA YA UNA HOJA DE VIDA

    const hojaVidaExistente = await HojaVida.findOne({ usuarioId });

    if (hojaVidaExistente) {
      throw new customError(
        "Este usuario ya tiene una hoja de vida registrada. No se permite crear duplicados.",
        409
      );
    }


    // CONSTRUIR Y GUARDAR LA HOJA DE VIDA

    const datosHojaVida = {
      usuarioId,
      apellidos: datosPersonales.apellidos,
      fechaNacimiento: datosPersonales.fechaNacimiento,
      genero: datosPersonales.genero,
      datosContacto: datosPersonales.datosContacto,
      // Cada item ya trae soporteBase64 y soporteNombre incluidos
      formacionAcademica,
      experienciaLaboral,
    };

    if (gerenciaPublica && Object.keys(gerenciaPublica).length > 0) {
      datosHojaVida.gerenciaPublica = gerenciaPublica;
    }

    const hojaVida = new HojaVida(datosHojaVida);
    await hojaVida.save();


    // RETORNAR CON DATOS DEL USUARIO POPULADO

    const hojaVidaPopulada = await HojaVida.findById(hojaVida._id).populate(
      "usuarioId",
      "nombres numIdentificacion tipoDocumento email rol"
    );

    return hojaVidaPopulada;
  } catch (error) {
    if (error.status) {
      throw error;
    }

    if (error.name === "ValidationError") {
      const mensaje = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      throw new customError(`Error de validación del modelo: ${mensaje}`, 400);
    }

    if (error.code === 11000) {
      throw new customError(
        "Este usuario ya tiene una hoja de vida registrada. No se permite crear duplicados.",
        409
      );
    }

    throw new customError(`Error al registrar hoja de vida: ${error.message}`, 500);
  }
};

/**
 * Obtener hoja de vida del usuario autenticado
 *
 * @param {String} usuarioId - ID del usuario autenticado
 * @returns {Object} - Documento de hoja de vida encontrado
 */
export const obtenerHojaVidaPorUsuario = async (usuarioId) => {
  try {
    const hojaVida = await HojaVida.findOne({ usuarioId }).populate(
      "usuarioId",
      "nombres numIdentificacion tipoDocumento email rol"
    );

    if (!hojaVida) {
      throw new customError("No se encontró una hoja de vida para este usuario", 404);
    }

    return hojaVida;
  } catch (error) {
    if (error.status) {
      throw error;
    }

    throw new customError(`Error al obtener hoja de vida: ${error.message}`, 500);
  }
};