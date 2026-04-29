import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import Recuperar from "../pages/Recuperar.jsx";
import CambiarContrasena from "../pages/CambiarContrasena.jsx";
import HojaDeVida from "../pages/HojaDeVida.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { usuarioAutenticado } = useAuth();

  if (!usuarioAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { usuarioAutenticado } = useAuth();

  if (usuarioAutenticado) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
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
      <Route
        path="/hoja-de-vida"
        element={
          <ProtectedRoute>
            <HojaDeVida />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}