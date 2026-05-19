import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { useAuth } from "../context/AuthContext.jsx";
import { cambiarContraseñaAPI } from "../services/apiService.js";

export default function CambiarContraseñaProtegido() {
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const { usuarioAutenticado, token, cerrarSesion } = useAuth();

  // Si no está autenticado, redirigir al login
  if (!usuarioAutenticado) {
    navigate("/login", { replace: true });
    return null;
  }

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!nueva || !confirmar) {
      setError("Todos los campos son obligatorios.");
      setMensaje("");
      return;
    }

    if (nueva !== confirmar) {
      setError("Las contraseñas nuevas no coinciden.");
      setMensaje("");
      return;
    }

    if (nueva.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres.");
      setMensaje("");
      return;
    }

    setError("");
    setCargando(true);

    try {
      const respuesta = await cambiarContraseñaAPI(nueva, token);

      setMensaje(respuesta.message || "Contraseña actualizada correctamente. Debes iniciar sesión nuevamente.");
      
      // Limpiar formulario después de 3 segundos y cerrar sesión
      setTimeout(() => {
        setNueva("");
        setConfirmar("");
        cerrarSesion();
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Error al cambiar la contraseña.");
      console.error("Error en cambio de contraseña:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-main" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <section className="login-contenedor" style={{ maxWidth: "500px", margin: "0 auto" }}>

        <div className="login-informacion">
          <h1 className="login-titulo">Cambiar contraseña</h1>
          <p className="login-texto">
            Actualiza tu contraseña para mantener la seguridad de tu cuenta.
          </p>

          <button
            className="login-enlace-blanco"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
        </div>

        <form className="login-tarjeta" onSubmit={manejarEnvio}>
          <div className="login-cabecera">
            <h2>Actualizar contraseña</h2>
            <p>Ingresa tu contraseña actual y la nueva que deseas usar.</p>
          </div>

          {error && <div className="login-error">{error}</div>}
          {mensaje && <div className="login-success">{mensaje}</div>}

          <label>Nueva contraseña *</label>
          <input
            type="password"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            disabled={cargando}
          />

          <label>Confirmar nueva contraseña *</label>
          <input
            type="password"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            placeholder="Repite la nueva contraseña"
            disabled={cargando}
          />

          <button type="submit" className="login-boton" disabled={cargando}>
            {cargando ? "Actualizando..." : "Cambiar contraseña"}
          </button>
        </form>

      </section>
    </div>
  );
}
