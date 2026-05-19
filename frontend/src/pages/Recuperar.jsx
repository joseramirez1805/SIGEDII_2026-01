import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import AuthLayout from "../components/AuthLayout.jsx";
import { recuperarContraseñaAPI } from "../services/apiService.js";

export default function Recuperar() {
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!tipoDocumento || !numeroDocumento) {
      setError("Todos los campos son obligatorios.");
      setMensaje("");
      return;
    }

    setError("");
    setCargando(true);

    try {
      // Mapear el tipo de documento al valor que espera el backend
      const tipoMap = {
        CC: "cedulaCiudadania",
        TI: "tarjetaIdentidad",
      };

      const tipoParaBackend = tipoMap[tipoDocumento] || tipoDocumento;

      // Llamar al backend
      const respuesta = await recuperarContraseñaAPI(tipoParaBackend, numeroDocumento);

      setMensaje(
        respuesta.message || "Si el usuario existe, se enviará una contraseña temporal al correo registrado."
      );
      
      // Limpiar formulario después de 3 segundos
      setTimeout(() => {
        setTipoDocumento("");
        setNumeroDocumento("");
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Error al recuperar la contraseña. Verifica los datos ingresados.");
      console.error("Error en recuperación:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthLayout>
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
                onClick={() => navigate("/login")}
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
              disabled={cargando}
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
              disabled={cargando}
              placeholder="Digite su número de documento"
            />

            <button type="submit" className="login-boton" disabled={cargando}>
              {cargando ? "Enviando..." : "Recuperar contraseña"}
            </button>
          </form>

        </section>
      </main>
    </AuthLayout>
  );
}