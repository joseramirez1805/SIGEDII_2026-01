import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import AuthLayout from "../components/AuthLayout.jsx";

export default function CambiarContrasena() {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const validarContrasena = (pass) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;
    return regex.test(pass);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!actual || !nueva || !confirmar) {
      setError("Todos los campos son obligatorios.");
      setMensaje("");
      return;
    }

    if (nueva !== confirmar) {
      setError("Las contraseñas no coinciden.");
      setMensaje("");
      return;
    }

    if (!validarContrasena(nueva)) {
      setError(
        "La contraseña debe tener mínimo 6 caracteres, letras, números y un carácter especial."
      );
      setMensaje("");
      return;
    }

    setError("");
    setMensaje("Contraseña actualizada correctamente.");
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
              <h2>Actualizar contraseña</h2>
            </div>

            {error && <div className="login-error">{error}</div>}
            {mensaje && <div className="login-success">{mensaje}</div>}

            <label>Contraseña actual *</label>
            <input
              type="password"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
            />

            <label>Nueva contraseña *</label>
            <input
              type="password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
            />

            <label>Confirmar contraseña *</label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />

            <button type="submit" className="login-boton">
              Cambiar contraseña
            </button>
          </form>

        </section>
      </main>
    </AuthLayout>
  );
}