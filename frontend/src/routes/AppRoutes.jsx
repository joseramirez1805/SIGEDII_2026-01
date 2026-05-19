import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import PanelSigep from "../pages/PanelSigep.jsx";
import JFHPanel from "../pages/JFHPanel.jsx";
import Recuperar from "../pages/Recuperar.jsx";
import CambiarContrasena from "../pages/CambiarContrasena.jsx";
import HojaDeVida from "../pages/HojaDeVida.jsx";
import CertificadoSigep from "../pages/CertificadoSigep.jsx";
import PreguntasFrecuentes from "../pages/PreguntasFrecuentes.jsx";
import ManualUsuario from "../pages/ManualUsuario.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { usuarioAutenticado } = useAuth();

  if (!usuarioAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { usuarioAutenticado, rol } = useAuth();

  if (usuarioAutenticado) {
    // Redirigir según el rol
    if (rol === "jefeTalentoHumano") {
      return <Navigate to="/panel-jfh" replace />;
    }
    return <Navigate to="/panel-sigep" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirección inicial */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Públicas */}
      <Route path="/home" element={<Home />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route path="/recuperar" element={<Recuperar />} />
      <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />

      {/* Privadas */}
      <Route
        path="/panel-sigep"
        element={
          <ProtectedRoute>
            <PanelSigep />
          </ProtectedRoute>
        }
      />

      <Route
        path="/panel-jfh"
        element={
          <ProtectedRoute>
            <JFHPanel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hoja-de-vida"
        element={
          <ProtectedRoute>
            <HojaDeVida />
          </ProtectedRoute>
        }
      />

      <Route
        path="/certificado-sigep"
        element={
          <ProtectedRoute>
            <CertificadoSigep />
          </ProtectedRoute>
        }
      />

      {/* Páginas auxiliares */}
      <Route
        path="/preguntas-frecuentes"
        element={
          <ProtectedRoute>
            <PreguntasFrecuentes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manual-usuario"
        element={
          <ProtectedRoute>
            <ManualUsuario />
          </ProtectedRoute>
        }
      />

      {/* Ruta no encontrada */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}