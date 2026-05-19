/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(() => {
    return localStorage.getItem("sigep-usuario-autenticado") === "true";
  });

  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("sigep-usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const [rol, setRol] = useState(() => {
    return localStorage.getItem("sigep-rol") || null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("sigep-token") || null;
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const iniciarSesion = (datosUsuario = {}, rolUsuario = "servidor_publico", accessToken = null) => {
    setUsuarioAutenticado(true);
    setRol(rolUsuario);
    setUsuario(datosUsuario);
    setToken(accessToken);
    setError(null);
    
    localStorage.setItem("sigep-usuario-autenticado", "true");
    localStorage.setItem("sigep-rol", rolUsuario);
    localStorage.setItem("sigep-usuario", JSON.stringify(datosUsuario));
    if (accessToken) {
      localStorage.setItem("sigep-token", accessToken);
    }
  };

  const cerrarSesion = () => {
    setUsuarioAutenticado(false);
    setRol(null);
    setUsuario(null);
    setToken(null);
    setError(null);
    
    localStorage.removeItem("sigep-usuario-autenticado");
    localStorage.removeItem("sigep-rol");
    localStorage.removeItem("sigep-usuario");
    localStorage.removeItem("sigep-token");
  };

  return (
    <AuthContext.Provider
      value={{
        usuarioAutenticado,
        iniciarSesion,
        cerrarSesion,
        usuario,
        rol,
        token,
        cargando,
        setCargando,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return contexto;
}