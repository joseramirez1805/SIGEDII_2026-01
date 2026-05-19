import { useState, useEffect } from "react";

export default function FormularioServidorPublico({
  onGuardar,
  onCancelar,
  servidorInicial,
  esEdicion,
}) {
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroIdentificacion, setNumeroIdentificacion] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [contrasenaConfirm, setContrasenaConfirm] = useState("");
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (servidorInicial && esEdicion) {
      setTipoDocumento(servidorInicial.tipoDocumento || "");
      setNumeroIdentificacion(servidorInicial.numeroIdentificacion || "");
      setNombre(servidorInicial.nombre || "");
      setCorreo(servidorInicial.correo || "");
      setContrasena("");
      setContrasenaConfirm("");
    }
  }, [servidorInicial, esEdicion]);

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar tipo de documento
    if (!tipoDocumento.trim()) {
      nuevosErrores.tipoDocumento = "El tipo de documento es requerido";
    }

    // Validar número de identificación
    if (!numeroIdentificacion.trim()) {
      nuevosErrores.numeroIdentificacion = "El número de identificación es requerido";
    } else if (!/^\d{6,}$/.test(numeroIdentificacion)) {
      nuevosErrores.numeroIdentificacion =
        "El número de identificación debe tener al menos 6 dígitos";
    }

    // Validar nombre
    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es requerido";
    } else if (nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    // Validar correo
    if (!correo.trim()) {
      nuevosErrores.correo = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      nuevosErrores.correo = "El correo no es válido";
    }

    // Validar contraseña
    if (!esEdicion || contrasena) {
      if (!contrasena.trim()) {
        nuevosErrores.contrasena = "La contraseña es requerida";
      } else if (contrasena.length < 8) {
        nuevosErrores.contrasena = "La contraseña debe tener mínimo 8 caracteres";
      }

      if (contrasena !== contrasenaConfirm) {
        nuevosErrores.contrasenaConfirm = "Las contraseñas no coinciden";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setCargando(true);

    // Enviar al handler padre para que lo cree en el backend
    const datos = {
      tipoDocumento,
      numeroIdentificacion,
      nombre,
      correo,
      ...(contrasena && { contrasena }),
    };

    onGuardar(datos);
    setCargando(false);

    // Limpiar formulario
    setTipoDocumento("");
    setNumeroIdentificacion("");
    setNombre("");
    setCorreo("");
    setContrasena("");
    setContrasenaConfirm("");
    setErrores({});
  };

  return (
    <form className="jfh-formulario" onSubmit={manejarEnvio}>
      <div className="jfh-form-header">
        <h3>{esEdicion ? "Editar Servidor Público" : "Crear Nuevo Servidor Público"}</h3>
        <p>
          {esEdicion
            ? "Actualiza la información del servidor público"
            : "Completa los datos del nuevo servidor público"}
        </p>
      </div>

      <div className="jfh-form-row">
        <div className="jfh-form-grupo">
          <label htmlFor="tipoDoc">
            Tipo de Documento <span className="jfh-requerido">*</span>
          </label>
          <select
            id="tipoDoc"
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            className={errores.tipoDocumento ? "jfh-input-error" : ""}
          >
            <option value="">Seleccione</option>
            <option value="CC">Cédula de ciudadanía</option>
            <option value="CE">Cédula de extranjería</option>
            <option value="TI">Tarjeta de identidad</option>
            <option value="PA">Pasaporte</option>
          </select>
          {errores.tipoDocumento && (
            <span className="jfh-error-msg">{errores.tipoDocumento}</span>
          )}
        </div>

        <div className="jfh-form-grupo">
          <label htmlFor="numeroId">
            Número de Identificación <span className="jfh-requerido">*</span>
          </label>
          <input
            type="text"
            id="numeroId"
            value={numeroIdentificacion}
            onChange={(e) => setNumeroIdentificacion(e.target.value)}
            placeholder="Ej: 123456789"
            className={errores.numeroIdentificacion ? "jfh-input-error" : ""}
          />
          {errores.numeroIdentificacion && (
            <span className="jfh-error-msg">{errores.numeroIdentificacion}</span>
          )}
        </div>
      </div>

      <div className="jfh-form-grupo">
        <label htmlFor="nombre">
          Nombre Completo <span className="jfh-requerido">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Juan Pérez García"
          className={errores.nombre ? "jfh-input-error" : ""}
        />
        {errores.nombre && (
          <span className="jfh-error-msg">{errores.nombre}</span>
        )}
      </div>

      <div className="jfh-form-grupo">
        <label htmlFor="correo">
          Correo Electrónico <span className="jfh-requerido">*</span>
        </label>
        <input
          type="email"
          id="correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="correo@example.com"
          className={errores.correo ? "jfh-input-error" : ""}
        />
        {errores.correo && <span className="jfh-error-msg">{errores.correo}</span>}
      </div>

      <div className="jfh-form-row">
        <div className="jfh-form-grupo">
          <label htmlFor="contrasena">
            Contraseña <span className="jfh-requerido">*</span>
            {esEdicion && <span className="jfh-opcional">(dejar vacío para mantener)</span>}
          </label>
          <input
            type="password"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className={errores.contrasena ? "jfh-input-error" : ""}
          />
          {errores.contrasena && (
            <span className="jfh-error-msg">{errores.contrasena}</span>
          )}
        </div>

        <div className="jfh-form-grupo">
          <label htmlFor="contrasenaConfirm">
            Confirmar Contraseña <span className="jfh-requerido">*</span>
          </label>
          <input
            type="password"
            id="contrasenaConfirm"
            value={contrasenaConfirm}
            onChange={(e) => setContrasenaConfirm(e.target.value)}
            placeholder="Repite la contraseña"
            className={errores.contrasenaConfirm ? "jfh-input-error" : ""}
          />
          {errores.contrasenaConfirm && (
            <span className="jfh-error-msg">{errores.contrasenaConfirm}</span>
          )}
        </div>
      </div>

      <div className="jfh-form-acciones">
        <button
          type="submit"
          className="jfh-btn-guardar"
          disabled={cargando}
        >
          {cargando ? "Guardando..." : esEdicion ? "Actualizar" : "Crear Servidor"}
        </button>
        <button
          type="button"
          className="jfh-btn-cancelar"
          onClick={onCancelar}
          disabled={cargando}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
