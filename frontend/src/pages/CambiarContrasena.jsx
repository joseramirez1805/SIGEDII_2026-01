import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import AuthLayout from "../components/AuthLayout.jsx";
import { cambiarContraseñaSinTokenAPI } from "../services/apiService.js";

export default function CambiarContrasena() {
  const [token, setToken] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!token || !nueva || !confirmar) {
      setError("Todos los campos son obligatorios.");
      setMensaje("");
      return;
    }

    if (nueva !== confirmar) {
      setError("Las contraseñas no coinciden.");
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
      // Llamar al backend
      const respuesta = await cambiarContraseñaSinTokenAPI(nueva, token);

      setMensaje(respuesta.message || "Contraseña actualizada correctamente.");
      
      // Limpiar formulario después de 3 segundos y redirigir a login
      setTimeout(() => {
        setToken("");
        setNueva("");
        setConfirmar("");
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Error al cambiar la contraseña. Verifica el token.");
      console.error("Error en cambio de contraseña:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthLayout>
      <main className="login-main">
        <section className="login-contenedor">

          <div className="login-informacion">
            <h1 className="login-titulo">Cambiar contraseña</h1>
            <p className="login-texto">
              Actualiza tu contraseña para mantener la seguridad de tu cuenta.
            </p>

            <button
              className="login-enlace-blanco"
              onClick={() => navigate("/login")}
            >
              ← Volver
            </button>
          </div>

          <form className="login-tarjeta" onSubmit={manejarEnvio}>
            <div className="login-cabecera">
              <h2>Cambiar contraseña</h2>
              <p>Ingresa el token recibido en tu correo y tu nueva contraseña.</p>
            </div>

            {error && <div className="login-error">{error}</div>}
            {mensaje && <div className="login-success">{mensaje}</div>}

            <label>Token de recuperación *</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Ingresa el token del correo"
              disabled={cargando}
            />

            <label>Nueva contraseña *</label>
            <input
              type="password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              disabled={cargando}
            />

            <label>Confirmar contraseña *</label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="Repite la contraseña"
              disabled={cargando}
            />

            <button type="submit" className="login-boton" disabled={cargando}>
              {cargando ? "Cambiando..." : "Cambiar contraseña"}
            </button>
          </form>

        </section>
      </main>
    </AuthLayout>
  );
}