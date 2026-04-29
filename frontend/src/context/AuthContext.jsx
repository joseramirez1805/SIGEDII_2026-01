import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  useEffect(() => {
    const sessionGuardada = localStorage.getItem("sigep-usuario-autenticado");

    if (sessionGuardada === "true") {
      setUsuarioAutenticado(true);
    }
  }, []);

  const iniciarSesion = () => {
    setUsuarioAutenticado(true);
    localStorage.setItem("sigep-usuario-autenticado", "true");
  };

  const cerrarSesion = () => {
    setUsuarioAutenticado(false);
    localStorage.removeItem("sigep-usuario-autenticado");
  };

  return (
    <AuthContext.Provider
      value={{
        usuarioAutenticado,
        iniciarSesion,
        cerrarSesion,
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