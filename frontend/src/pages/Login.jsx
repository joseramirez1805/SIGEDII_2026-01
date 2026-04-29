import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import AuthLayout from "../components/AuthLayout.jsx";

export default function Login({ setUsuarioAutenticado }) {
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const navigate = useNavigate();

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
      navigate("/home");
    } else {
      setMensajeError("Credenciales inválidas");
    }
  };

  return (
    <AuthLayout>
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
                onClick={() => navigate("/recuperar")}
            >
              ¿Olvidó su contraseña?
            </button>

            <button
                type="button"
                className="login-enlace"
              onClick={() => navigate("/cambiar-contrasena")}
            >
                Cambiar contraseña
            </button>
          </form>
        </section>
      </main>
    </AuthLayout>
  );
}