import { useState } from "react";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Recuperar from "./pages/Recuperar.jsx";
import CambiarContrasena from "./pages/CambiarContrasena.jsx";
import HojaDeVida from "./pages/HojaDeVida.jsx";

export default function App() {
  const [pagina, setPagina] = useState("login");
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  if (pagina === "recuperar") {
    return <Recuperar setPagina={setPagina} />;
  }

  if (pagina === "cambiar") {
    return <CambiarContrasena setPagina={setPagina} />;
  }

  if (pagina === "hoja") {
  return <HojaDeVida setPagina={setPagina} />;
}

  if (!usuarioAutenticado) {
    return (
      <Login
        setUsuarioAutenticado={setUsuarioAutenticado}
        setPagina={setPagina}
      />
    );
  }

  return <Home setPagina={setPagina} />;
}