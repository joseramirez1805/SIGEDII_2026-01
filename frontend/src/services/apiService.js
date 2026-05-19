// Configuración de la API base
const API_BASE_URL = "";
const API_VIDA_URL = "/api";

// Headers por defecto
const getHeaders = (token = null) => {
  // Preferir el token pasado como parámetro; si no viene, usar el guardado
  const effectiveToken = token || localStorage.getItem("sigep-token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (effectiveToken) {
    headers.Authorization = `Bearer ${effectiveToken}`;
  }

  return headers;
};

// ==================== AUTENTICACIÓN ====================

export const loginAPI = async (tipoDocumento, numIdentificacion, contrasena) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        tipoDocumento,
        numIdentificacion,
        contrasena,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error en el login");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en loginAPI:", error);
    throw error;
  }
};

export const registrarUsuarioAPI = async (datosUsuario, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/registrarUsuario`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(datosUsuario),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al registrar usuario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en registrarUsuarioAPI:", error);
    throw error;
  }
};

export const recuperarContraseñaAPI = async (tipoDocumento, numIdentificacion) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/recuperarContrasena`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        tipoDocumento,
        numIdentificacion,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al recuperar contraseña");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en recuperarContraseñaAPI:", error);
    throw error;
  }
};

export const cambiarContraseñaAPI = async (nuevaContrasena, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/usuarios/cambioContrasena-protegido`,
      {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify({ contraseña: nuevaContrasena }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al cambiar contraseña");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en cambiarContraseñaAPI:", error);
    throw error;
  }
};

export const cambiarContraseñaSinTokenAPI = async (contraseña, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/cambioContrasena`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        contraseña,
        token,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al cambiar contraseña");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en cambiarContraseñaSinTokenAPI:", error);
    throw error;
  }
};

// ==================== HOJA DE VIDA ====================

export const obtenerHojaVidaAPI = async (token) => {
  try {
    const response = await fetch(`${API_VIDA_URL}/hoja-vida`, {
      method: "GET",
      headers: getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener hoja de vida");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en obtenerHojaVidaAPI:", error);
    throw error;
  }
};

export const actualizarHojaVidaAPI = async (datosHojaVida, token) => {
  try {
    const response = await fetch(`${API_VIDA_URL}/hoja-vida`, {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(datosHojaVida),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al actualizar hoja de vida");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en actualizarHojaVidaAPI:", error);
    throw error;
  }
};
