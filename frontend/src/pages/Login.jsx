import { useState } from "react";
import "../css/Login.css";

export default function Login({ setUsuarioAutenticado, setPagina }) {
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const manejarEnvio = (evento) => {
    evento.preventDefault();

    if (!tipoDocumento || !numeroDocumento || !contrasena) {
      setMensajeError("Todos los campos son obligatorios.");
      return;
    }

    setMensajeError("");

    // SIMULACIÓN LOGIN
    if (numeroDocumento === "123" && contrasena === "123") {
      setUsuarioAutenticado(true);
    } else {
      setMensajeError("Credenciales inválidas");
    }
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

      <main className="login-main">
        <section className="login-contenedor">
          <div className="login-informacion">
            <h1 className="login-titulo">Bienvenido a SIGEP II</h1>
            <p className="login-texto">
              Accede con tu tipo y número de documento para ingresar a los módulos del sistema.
            </p>

            <div className="login-detalle">
              <span className="login-punto"></span>
              <span>Autenticación segura para servidores públicos.</span>
            </div>

            <div className="login-detalle">
              <span className="login-punto"></span>
              <span>Recuperación y cambio de contraseña desde el sistema.</span>
            </div>

            <div className="login-detalle">
              <span className="login-punto"></span>
              <span>Acceso al módulo de hoja de vida según tu rol.</span>
            </div>
          </div>

          <form className="login-tarjeta" onSubmit={manejarEnvio}>
            <div className="login-cabecera">
              <h2>Iniciar sesión</h2>
              <p>Ingresa tus credenciales para continuar.</p>
            </div>

            {mensajeError && <div className="login-error">{mensajeError}</div>}

            <label>Tipo de documento *</label>
            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
            >
              <option value="">Seleccione</option>
              <option value="CC">Cédula de ciudadanía</option>
              <option value="CE">Cédula de extranjería</option>
              <option value="TI">Tarjeta de identidad</option>
              <option value="PA">Pasaporte</option>
            </select>

            <label>Número de documento *</label>
            <input
              type="text"
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              placeholder="Digite su número de documento"
            />

            <label>Contraseña *</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Digite su contraseña"
            />

            <button type="submit" className="login-boton">
              Ingresar
            </button>

            <button
                type="button"
                className="login-enlace"
                onClick={() => setPagina("recuperar")}
            >
              ¿Olvidó su contraseña?
            </button>

            <button
                type="button"
                className="login-enlace"
                onClick={() => setPagina("cambiar")}
            >
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
  );
}