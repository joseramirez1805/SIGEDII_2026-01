import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import Recuperar from "../pages/Recuperar.jsx";
import CambiarContrasena from "../pages/CambiarContrasena.jsx";
import HojaDeVida from "../pages/HojaDeVida.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login setUsuarioAutenticado={() => {}} />} />
      <Route path="/recuperar" element={<Recuperar />} />
      <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
      <Route path="/hoja-de-vida" element={<HojaDeVida />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}