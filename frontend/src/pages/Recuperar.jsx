import { useState } from "react";
import "../css/login.css";

export default function Recuperar({ setPagina }) {
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!tipoDocumento || !numeroDocumento) {
      setError("Todos los campos son obligatorios.");
      setMensaje("");
      return;
    }

    setError("");

    // Simulación
    setMensaje(
      "Si el usuario existe, se enviará una contraseña temporal al correo registrado."
    );
  };

  return (
    <div className="sigep-root login-root">
      <main className="login-main">
        <section className="login-contenedor">

          <div className="login-informacion">
            <h1 className="login-titulo">Recuperar contraseña</h1>
            <p className="login-texto">
              Ingresa tu tipo y número de documento para recuperar el acceso al sistema.
            </p>

            {/* BOTÓN VOLVER */}
            <button
                className="login-enlace-blanco"
                onClick={() => setPagina("login")}
            >
              ← Volver al login
            </button>
          </div>

          <form className="login-tarjeta" onSubmit={manejarEnvio}>
            <div className="login-cabecera">
              <h2>Recuperación</h2>
              <p>Completa los datos para continuar.</p>
            </div>

            {error && <div className="login-error">{error}</div>}
            {mensaje && <div className="login-success">{mensaje}</div>}

            <label>Tipo de documento *</label>
            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
            >
              <option value="">Seleccione</option>
              <option value="CC">Cédula</option>
              <option value="TI">Tarjeta de identidad</option>
            </select>

            <label>Número de documento *</label>
            <input
              type="text"
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
            />

            <button type="submit" className="login-boton">
              Recuperar contraseña
            </button>
          </form>

        </section>
      </main>
    </div>
  );
}