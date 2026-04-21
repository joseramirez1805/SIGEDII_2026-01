import { useState } from "react";
import "../css/Login.css";

export default function CambiarContrasena({ setPagina }) {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

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
  <div className="sigep-root login-root">
      <header className="top-bar">
        <div className="gov-logo">GOV.CO</div>
        <div className="top-bar-right">
          <button type="button">Seleccionar idioma</button>
          <a href="#">INGRESAR A LA INTRANET</a>
          <span>A+</span>
          <span>A-</span>
        </div>
      </header>

      <nav className="navbar">
        <div className="nav-brand">
          <div className="brand-name">Función Pública</div>
        </div>

        <ul className="nav-links">
          <li><a href="#">SIGEP II</a></li>
          <li><a href="#">¿Qué es?</a></li>
          <li><a href="#">Directorios</a></li>
          <li><a href="#">Cifras</a></li>
          <li><a href="#">Instructivos y Formatos</a></li>
          <li><a href="#">Preguntas Frecuentes</a></li>
          <li><a className="active" href="#">Ingresar</a></li>
        </ul>
      </nav>
    <div className="sigep-root login-root">
      <main className="login-main">
        <section className="login-contenedor">

          <div className="login-informacion">
            <h1 className="login-titulo">Cambiar contraseña</h1>
            <p className="login-texto">
              Actualiza tu contraseña para mantener la seguridad de tu cuenta.
            </p>

            <button
              className="login-enlace-blanco"
              onClick={() => setPagina("login")}
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
      <footer className="footer">
        <div>
          Departamento Administrativo de la Función Pública — República de Colombia
        </div>
        <div className="footer-meta">
          <a href="#">www.funcionpublica.gov.co</a> | PBX: 601 7395656
        </div>
      </footer>
    </div>
  </div>
  );
}