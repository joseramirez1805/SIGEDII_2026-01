import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../css/HojaDeVida.css";

const MODULOS = [
  { id: "datos", titulo: "Datos Personales" },
  { id: "educacion", titulo: "Educación" },
  { id: "experiencia", titulo: "Experiencia Laboral" },
  { id: "docencia", titulo: "Experiencia Laboral Docente" },
  { id: "documentos", titulo: "Documentos Adicionales" },
  { id: "gerencia", titulo: "Gerencia Pública" },
];

const TAMANO_MAXIMO_2MB = 2 * 1024 * 1024;

function esArchivoPDF(archivo) {
  return archivo?.type === "application/pdf";
}

function esArchivoImagenJPG(archivo) {
  return archivo?.type === "image/jpeg";
}

function esArchivoPermitidoAdjunto(archivo) {
  return esArchivoPDF(archivo) || esArchivoImagenJPG(archivo);
}

export default function HojaDeVida() {
  const [moduloActual, setModuloActual] = useState("datos");
  const [submodulo, setSubmodulo] = useState("basicos");

  const navigate = useNavigate();
  const { cerrarSesion } = useAuth();

  const descargarHojaVida = () => {
    const contenido = document.documentElement.outerHTML;

    const blob = new Blob([contenido], {
      type: "text/html",
    });

    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "hoja_de_vida_sigep.html";
    enlace.click();
  };

  const renderizarContenido = () => {
    switch (moduloActual) {
      case "datos":
        return (
          <ModuloDatos
            submodulo={submodulo}
            setSubmodulo={setSubmodulo}
          />
        );

      case "educacion":
        return <ModuloEducacion />;

      case "experiencia":
        return <ModuloExperiencia />;

      case "docencia":
        return <ModuloDocencia />;

      case "documentos":
        return <ModuloDocumentos />;

      case "gerencia":
        return <ModuloGerencia />;

      default:
        return null;
    }
  };

return (
  <div className="hv-root">
    <header className="hv-header">
      <div className="hv-header-left">
        <div className="hv-logo">sigepII</div>
        <div className="hv-titulo-principal">Función Pública</div>
      </div>

      <div className="hv-header-right">
        <span>Ivan Mauricio Cabezas Troyano</span>

        <button
          type="button"
          onClick={() => cerrarSesion()}
        >
          Cerrar sesión
        </button>
      </div>
    </header>

    <nav className="hv-nav-principal">
      {MODULOS.map((mod) => (
        <button
          key={mod.id}
          type="button"
          className={`hv-tab ${
            moduloActual === mod.id ? "activo" : ""
          }`}
          onClick={() => {
            setModuloActual(mod.id);
            setSubmodulo("basicos");
          }}
        >
          {mod.titulo}
        </button>
      ))}
    </nav>

    <div className="hv-contenedor">

      {moduloActual === "datos" && (
        <div className="hv-acciones-superiores">
          <button
            type="button"
            className="hv-boton-secundario"
            onClick={() => window.print()}
          >
            Imprimir hoja de vida
          </button>

          <button
            type="button"
            className="hv-boton-principal"
            onClick={descargarHojaVida}
          >
            Descargar hoja de vida
          </button>
        </div>
      )}

      <h1>
        {MODULOS.find(
          (m) => m.id === moduloActual
        )?.titulo}
      </h1>

      {renderizarContenido()}
    </div>

    <footer className="hv-footer">
      <button
        type="button"
        className="hv-boton-volver"
        onClick={() => navigate("/panel-sigep")}
      >
        ← Volver al panel
      </button>
    </footer>
  </div>
);
}

/* =====================
   MÓDULO DATOS PERSONALES
===================== */

function ModuloDatos({ submodulo, setSubmodulo }) {
  const [datosBasicos] = useState({
    nombre: "Ivan Mauricio Cabezas Troyano",
    tipoDoc: "CÉDULA DE CIUDADANÍA",
    numeroDoc: "13456789",
    correo: "ivan@example.com",
  });

  return (
    <div className="hv-modulo">
      <div className="hv-subtabs">
        <button
          type="button"
          className={`hv-subtab ${submodulo === "basicos" ? "activo" : ""}`}
          onClick={() => setSubmodulo("basicos")}
        >
          Datos Básicos
        </button>

        <button
          type="button"
          className={`hv-subtab ${submodulo === "demograficos" ? "activo" : ""}`}
          onClick={() => setSubmodulo("demograficos")}
        >
          Datos Demográficos
        </button>

        <button
          type="button"
          className={`hv-subtab ${submodulo === "contacto" ? "activo" : ""}`}
          onClick={() => setSubmodulo("contacto")}
        >
          Datos de Contacto
        </button>
      </div>

      <div className="hv-formulario">
        {submodulo === "basicos" && (
          <div className="hv-seccion">
            <h3>Datos Básicos de Identificación</h3>

            <div className="hv-grid-2">
              <div className="hv-campo">
                <label>Nombre</label>
                <input type="text" value={datosBasicos.nombre} readOnly />
              </div>

              <div className="hv-campo">
                <label>Tipo de Documento</label>
                <input type="text" value={datosBasicos.tipoDoc} readOnly />
              </div>

              <div className="hv-campo">
                <label>Número de Documento</label>
                <input type="text" value={datosBasicos.numeroDoc} readOnly />
              </div>

              <div className="hv-campo">
                <label>Correo</label>
                <input type="email" value={datosBasicos.correo} readOnly />
              </div>
            </div>
          </div>
        )}

        {submodulo === "demograficos" && (
          <div className="hv-seccion">
            <h3>Datos Demográficos</h3>

            <div className="hv-grid-2">
              <div className="hv-campo">
                <label>Género</label>
                <select defaultValue="MASCULINO">
                  <option>MASCULINO</option>
                  <option>FEMENINO</option>
                </select>
              </div>

              <div className="hv-campo">
                <label>Fecha de nacimiento</label>
                <input type="date" defaultValue="1972-01-30" />
              </div>

              <div className="hv-campo">
                <label>Estado civil</label>
                <select defaultValue="CASADO">
                  <option>SOLTERO</option>
                  <option>CASADO</option>
                </select>
              </div>

              <div className="hv-campo">
                <label>Nacionalidad</label>
                <input type="text" value="COLOMBIANA" readOnly />
              </div>
            </div>
          </div>
        )}

        {submodulo === "contacto" && (
          <div className="hv-seccion">
            <h3>Datos de Contacto</h3>

            <div className="hv-grid-2">
              <div className="hv-campo">
                <label>Teléfono móvil</label>
                <input type="text" defaultValue="3015234567" />
              </div>

              <div className="hv-campo">
                <label>Teléfono fijo</label>
                <input type="text" defaultValue="6017395656" />
              </div>

              <div className="hv-campo">
                <label>Dirección</label>
                <input type="text" defaultValue="Calle 22 # 45-67" />
              </div>

              <div className="hv-campo">
                <label>Ciudad</label>
                <input type="text" defaultValue="Bogotá" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================
   MÓDULO EDUCACIÓN
===================== */

function ModuloEducacion() {
  const [form, setForm] = useState({
    nivel: "",
    institucion: "",
    titulo: "",
    fechaGrado: "",
  });

  const [archivoSoporte, setArchivoSoporte] = useState(null);
  const [lista, setLista] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const manejarArchivo = (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    if (!esArchivoPDF(archivo)) {
      setError("El soporte debe ser un archivo PDF.");
      setMensaje("");
      setArchivoSoporte(null);
      e.target.value = "";
      return;
    }

    if (archivo.size > TAMANO_MAXIMO_2MB) {
      setError("El archivo supera el límite de 2 MB.");
      setMensaje("");
      setArchivoSoporte(null);
      e.target.value = "";
      return;
    }

    setError("");
    setArchivoSoporte(archivo);
  };

  const guardar = () => {
    if (!form.nivel || !form.institucion || !form.titulo || !form.fechaGrado) {
      setError("Todos los campos son obligatorios.");
      setMensaje("");
      return;
    }

    if (!archivoSoporte) {
      setError("Debes adjuntar un soporte en PDF.");
      setMensaje("");
      return;
    }

    const nuevo = {
      id: Date.now(),
      ...form,
      soporteNombre: archivoSoporte.name,
      soporteUrl: URL.createObjectURL(archivoSoporte),
    };

    setLista([nuevo, ...lista]);
    setMensaje("Registro guardado correctamente.");
    setError("");
    setForm({
      nivel: "",
      institucion: "",
      titulo: "",
      fechaGrado: "",
    });
    setArchivoSoporte(null);
  };

  return (
    <div className="hv-bloque">
      <h2>Educación</h2>

      {error && <div className="login-error">{error}</div>}
      {mensaje && <div className="login-success">{mensaje}</div>}

      <div className="hv-form-grid">
        <div>
          <label>Nivel académico *</label>
          <select
            name="nivel"
            value={form.nivel}
            onChange={manejarCambio}
          >
            <option value="">Seleccione</option>
            <option value="Pregrado">Pregrado</option>
            <option value="Posgrado">Posgrado</option>
            <option value="Tarjeta profesional">Tarjeta profesional</option>
          </select>
        </div>

        <div>
          <label>Institución *</label>
          <input
            name="institucion"
            value={form.institucion}
            onChange={manejarCambio}
            placeholder="Nombre de la institución"
          />
        </div>

        <div>
          <label>Título obtenido *</label>
          <input
            name="titulo"
            value={form.titulo}
            onChange={manejarCambio}
            placeholder="Ej: Ingeniería de Sistemas"
          />
        </div>

        <div>
          <label>Fecha de grado *</label>
          <input
            type="date"
            name="fechaGrado"
            value={form.fechaGrado}
            onChange={manejarCambio}
          />
        </div>

        <div className="hv-columna-completa">
          <label>Soporte académico en PDF (máx. 2 MB) *</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={manejarArchivo}
          />
          {archivoSoporte && (
            <p className="hv-nota-archivo">
              Archivo seleccionado: {archivoSoporte.name}
            </p>
          )}
        </div>
      </div>

      <div className="hv-acciones-formulario">
        <button
          type="button"
          className="hv-boton-principal"
          onClick={guardar}
        >
          Guardar formación
        </button>
      </div>

      <div className="hv-lista-documentos">
        <h3>Formación registrada</h3>

        {lista.length === 0 ? (
          <p>No hay formación registrada.</p>
        ) : (
          lista.map((item) => (
            <div key={item.id} className="hv-documento-item">
              <div>
                <strong>{item.nivel}</strong> - {item.titulo}
                <div>{item.institucion}</div>
                <small>{item.fechaGrado}</small>
              </div>

              <button
                type="button"
                className="hv-boton-secundario"
                onClick={() => window.open(item.soporteUrl, "_blank", "noopener,noreferrer")}
              >
                Mostrar documento
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =====================
   MÓDULO EXPERIENCIA LABORAL
===================== */

function ModuloExperiencia() {
  const [form, setForm] = useState({
    institucion: "",
    cargo: "",
    jornada: "",
    fechaInicio: "",
    fechaFin: "",
    actual: false,
    motivoRetiro: "",
  });

  const [archivoSoporte, setArchivoSoporte] = useState(null);
  const [experiencias, setExperiencias] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const manejarArchivo = (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    const esPDF = archivo.type === "application/pdf";
    const esJPG =
      archivo.type === "image/jpeg" ||
      archivo.name.toLowerCase().endsWith(".jpg") ||
      archivo.name.toLowerCase().endsWith(".jpeg");

    if (!esPDF && !esJPG) {
      setError("Solo se permiten archivos PDF o JPG.");
      setMensaje("");
      setArchivoSoporte(null);
      e.target.value = "";
      return;
    }

    if (archivo.size > TAMANO_MAXIMO_2MB) {
      setError("El archivo supera el límite de 2 MB.");
      setMensaje("");
      setArchivoSoporte(null);
      e.target.value = "";
      return;
    }

    setError("");
    setArchivoSoporte(archivo);
  };

  const validar = () => {
    if (!form.institucion || !form.cargo || !form.jornada || !form.fechaInicio) {
      return "Completa los campos obligatorios de experiencia laboral.";
    }

    if (!form.actual && !form.fechaFin) {
      return "Debes ingresar fecha fin o marcar trabajo actual.";
    }

    if (form.fechaFin && form.fechaFin < form.fechaInicio) {
      return "La fecha fin no puede ser menor que la fecha inicio.";
    }

    if (!archivoSoporte) {
      return "Debes adjuntar la certificación en PDF o JPG.";
    }

    return "";
  };

  const guardar = () => {
    const errorValidacion = validar();

    if (errorValidacion) {
      setError(errorValidacion);
      setMensaje("");
      return;
    }

    const nuevoRegistro = {
      id: Date.now(),
      ...form,
      soporteNombre: archivoSoporte.name,
      soporteUrl: URL.createObjectURL(archivoSoporte),
    };

    setExperiencias([nuevoRegistro, ...experiencias]);
    setError("");
    setMensaje("Experiencia laboral guardada correctamente.");
    setForm({
      institucion: "",
      cargo: "",
      jornada: "",
      fechaInicio: "",
      fechaFin: "",
      actual: false,
      motivoRetiro: "",
    });
    setArchivoSoporte(null);
  };

  return (
    <div className="hv-bloque">
      <h2>Experiencia laboral</h2>

      {error && <div className="login-error">{error}</div>}
      {mensaje && <div className="login-success">{mensaje}</div>}

      <div className="hv-form-grid">
        <div>
          <label>Institución *</label>
          <input
            name="institucion"
            value={form.institucion}
            onChange={manejarCambio}
            placeholder="Entidad o empresa"
          />
        </div>

        <div>
          <label>Cargo *</label>
          <input
            name="cargo"
            value={form.cargo}
            onChange={manejarCambio}
            placeholder="Nombre del cargo"
          />
        </div>

        <div>
          <label>Jornada *</label>
          <select
            name="jornada"
            value={form.jornada}
            onChange={manejarCambio}
          >
            <option value="">Seleccione</option>
            <option value="Tiempo completo">Tiempo completo</option>
            <option value="Medio tiempo">Medio tiempo</option>
            <option value="Cátedra">Cátedra</option>
            <option value="Prestación de servicios">Prestación de servicios</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label>Fecha inicio *</label>
          <input
            type="date"
            name="fechaInicio"
            value={form.fechaInicio}
            onChange={manejarCambio}
          />
        </div>

        {!form.actual && (
          <div>
            <label>Fecha fin *</label>
            <input
              type="date"
              name="fechaFin"
              value={form.fechaFin}
              onChange={manejarCambio}
            />
          </div>
        )}

        <div className="hv-checkbox">
          <input
            type="checkbox"
            id="experienciaActual"
            name="actual"
            checked={form.actual}
            onChange={manejarCambio}
          />
          <label htmlFor="experienciaActual">Trabajo actual</label>
        </div>

        <div className="hv-columna-completa">
          <label>Motivo de retiro</label>
          <input
            name="motivoRetiro"
            value={form.motivoRetiro}
            onChange={manejarCambio}
            placeholder="Opcional si es trabajo actual"
          />
        </div>

        <div className="hv-columna-completa">
          <label>Certificación (PDF o JPG, máx. 2 MB) *</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg"
            onChange={manejarArchivo}
          />
          {archivoSoporte && (
            <p className="hv-nota-archivo">
              Archivo seleccionado: {archivoSoporte.name}
            </p>
          )}
        </div>
      </div>

      <div className="hv-acciones-formulario">
        <button
          type="button"
          className="hv-boton-principal"
          onClick={guardar}
        >
          Agregar experiencia
        </button>
      </div>

      <div className="hv-lista-documentos">
        <h3>Experiencia registrada</h3>

        {experiencias.length === 0 ? (
          <p>No hay experiencia registrada.</p>
        ) : (
          experiencias.map((item) => (
            <div key={item.id} className="hv-documento-item">
              <div>
                <strong>{item.cargo}</strong> - {item.institucion}
                <div>{item.jornada}</div>
                <small>
                  {item.fechaInicio}{" "}
                  {item.actual ? "→ Actualidad" : `→ ${item.fechaFin}`}
                </small>
              </div>

              <button
                type="button"
                className="hv-boton-secundario"
                onClick={() =>
                  window.open(item.soporteUrl, "_blank", "noopener,noreferrer")
                }
              >
                Mostrar documento
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =====================
   MÓDULO DOCENCIA
===================== */

function ModuloDocencia() {
  const [form, setForm] = useState({
    institucionEducativa: "",
    materia: "",
    nivelAcademico: "",
    fechaInicio: "",
    fechaFin: "",
    actual: false,
  });

  const [archivoSoporte, setArchivoSoporte] = useState(null);
  const [docencias, setDocencias] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const manejarArchivo = (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    const esPDF = archivo.type === "application/pdf";
    const esJPG =
      archivo.type === "image/jpeg" ||
      archivo.name.toLowerCase().endsWith(".jpg") ||
      archivo.name.toLowerCase().endsWith(".jpeg");

    if (!esPDF && !esJPG) {
      setError("Solo se permiten archivos PDF o JPG.");
      setMensaje("");
      setArchivoSoporte(null);
      e.target.value = "";
      return;
    }

    if (archivo.size > TAMANO_MAXIMO_2MB) {
      setError("El archivo supera el límite de 2 MB.");
      setMensaje("");
      setArchivoSoporte(null);
      e.target.value = "";
      return;
    }

    setError("");
    setArchivoSoporte(archivo);
  };

  const validar = () => {
    if (
      !form.institucionEducativa ||
      !form.materia ||
      !form.nivelAcademico ||
      !form.fechaInicio
    ) {
      return "Completa los campos obligatorios de experiencia docente.";
    }

    if (!form.actual && !form.fechaFin) {
      return "Debes ingresar fecha fin o marcar docencia actual.";
    }

    if (form.fechaFin && form.fechaFin < form.fechaInicio) {
      return "La fecha fin no puede ser menor que la fecha inicio.";
    }

    if (!archivoSoporte) {
      return "Debes adjuntar el soporte en PDF o JPG.";
    }

    return "";
  };

  const guardar = () => {
    const errorValidacion = validar();

    if (errorValidacion) {
      setError(errorValidacion);
      setMensaje("");
      return;
    }

    const nuevoRegistro = {
      id: Date.now(),
      ...form,
      soporteNombre: archivoSoporte.name,
      soporteUrl: URL.createObjectURL(archivoSoporte),
    };

    setDocencias([nuevoRegistro, ...docencias]);
    setError("");
    setMensaje("Experiencia docente guardada correctamente.");
    setForm({
      institucionEducativa: "",
      materia: "",
      nivelAcademico: "",
      fechaInicio: "",
      fechaFin: "",
      actual: false,
    });
    setArchivoSoporte(null);
  };

  return (
    <div className="hv-bloque">
      <h2>Experiencia laboral docente</h2>

      {error && <div className="login-error">{error}</div>}
      {mensaje && <div className="login-success">{mensaje}</div>}

      <div className="hv-form-grid">
        <div>
          <label>Institución educativa *</label>
          <input
            name="institucionEducativa"
            value={form.institucionEducativa}
            onChange={manejarCambio}
            placeholder="Nombre de la institución"
          />
        </div>

        <div>
          <label>Materia impartida *</label>
          <input
            name="materia"
            value={form.materia}
            onChange={manejarCambio}
            placeholder="Ej: Matemáticas"
          />
        </div>

        <div>
          <label>Nivel académico *</label>
          <select
            name="nivelAcademico"
            value={form.nivelAcademico}
            onChange={manejarCambio}
          >
            <option value="">Seleccione</option>
            <option value="Preescolar">Preescolar</option>
            <option value="Primaria">Primaria</option>
            <option value="Secundaria">Secundaria</option>
            <option value="Media">Media</option>
            <option value="Universitario">Universitario</option>
          </select>
        </div>

        <div>
          <label>Fecha inicio *</label>
          <input
            type="date"
            name="fechaInicio"
            value={form.fechaInicio}
            onChange={manejarCambio}
          />
        </div>

        {!form.actual && (
          <div>
            <label>Fecha fin *</label>
            <input
              type="date"
              name="fechaFin"
              value={form.fechaFin}
              onChange={manejarCambio}
            />
          </div>
        )}

        <div className="hv-checkbox">
          <input
            type="checkbox"
            id="docenciaActual"
            name="actual"
            checked={form.actual}
            onChange={manejarCambio}
          />
          <label htmlFor="docenciaActual">Docencia actual</label>
        </div>

        <div className="hv-columna-completa">
          <label>Soporte (PDF o JPG, máx. 2 MB) *</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg"
            onChange={manejarArchivo}
          />
          {archivoSoporte && (
            <p className="hv-nota-archivo">
              Archivo seleccionado: {archivoSoporte.name}
            </p>
          )}
        </div>
      </div>

      <div className="hv-acciones-formulario">
        <button
          type="button"
          className="hv-boton-principal"
          onClick={guardar}
        >
          Agregar docencia
        </button>
      </div>

      <div className="hv-lista-documentos">
        <h3>Experiencia docente registrada</h3>

        {docencias.length === 0 ? (
          <p>No hay experiencia docente registrada.</p>
        ) : (
          docencias.map((item) => (
            <div key={item.id} className="hv-documento-item">
              <div>
                <strong>{item.materia}</strong> - {item.institucionEducativa}
                <div>{item.nivelAcademico}</div>
                <small>
                  {item.fechaInicio}{" "}
                  {item.actual ? "→ Actualidad" : `→ ${item.fechaFin}`}
                </small>
              </div>

              <button
                type="button"
                className="hv-boton-secundario"
                onClick={() =>
                  window.open(item.soporteUrl, "_blank", "noopener,noreferrer")
                }
              >
                Mostrar documento
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
/* =====================
   MÓDULO DOCUMENTOS
===================== */

function ModuloDocumentos() {
  const [form, setForm] = useState({
    tipo: "",
    nombre: "",
    observacion: "",
  });

  const [archivo, setArchivo] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const manejarArchivo = (e) => {
    const archivoSeleccionado = e.target.files?.[0];

    if (!archivoSeleccionado) return;

    const esPDF = archivoSeleccionado.type === "application/pdf";

    const esJPG =
      archivoSeleccionado.type === "image/jpeg" ||
      archivoSeleccionado.name.toLowerCase().endsWith(".jpg") ||
      archivoSeleccionado.name.toLowerCase().endsWith(".jpeg");

    if (!esPDF && !esJPG) {
      setError("Solo se permiten archivos PDF o JPG.");
      setMensaje("");
      setArchivo(null);
      e.target.value = "";
      return;
    }

    if (archivoSeleccionado.size > TAMANO_MAXIMO_2MB) {
      setError("El archivo supera el límite de 2 MB.");
      setMensaje("");
      setArchivo(null);
      e.target.value = "";
      return;
    }

    setError("");
    setArchivo(archivoSeleccionado);
  };

  const validar = () => {
    if (!form.tipo || !form.nombre) {
      return "Completa todos los campos obligatorios.";
    }

    if (!archivo) {
      return "Debes adjuntar un documento.";
    }

    return "";
  };

  const guardarDocumento = () => {
    const errorValidacion = validar();

    if (errorValidacion) {
      setError(errorValidacion);
      setMensaje("");
      return;
    }

    const nuevoDocumento = {
      id: Date.now(),
      ...form,
      archivoNombre: archivo.name,
      archivoUrl: URL.createObjectURL(archivo),
    };

    setDocumentos([nuevoDocumento, ...documentos]);

    setForm({
      tipo: "",
      nombre: "",
      observacion: "",
    });

    setArchivo(null);
    setError("");
    setMensaje("Documento cargado correctamente.");
  };

  const eliminarDocumento = (id) => {
    setDocumentos(documentos.filter((doc) => doc.id !== id));
  };

  return (
    <div className="hv-bloque">
      <h2>Documentos adicionales</h2>

      {error && <div className="login-error">{error}</div>}
      {mensaje && <div className="login-success">{mensaje}</div>}

      <div className="hv-form-grid">
        <div>
          <label>Tipo de documento *</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={manejarCambio}
          >
            <option value="">Seleccione</option>
            <option value="Certificación">Certificación</option>
            <option value="Diploma">Diploma</option>
            <option value="Tarjeta profesional">Tarjeta profesional</option>
            <option value="Curso">Curso</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label>Nombre del documento *</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={manejarCambio}
            placeholder="Nombre del documento"
          />
        </div>

        <div className="hv-columna-completa">
          <label>Observación</label>
          <input
            name="observacion"
            value={form.observacion}
            onChange={manejarCambio}
            placeholder="Comentario opcional"
          />
        </div>

        <div className="hv-columna-completa">
          <label>Archivo (PDF o JPG, máx. 2 MB) *</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg"
            onChange={manejarArchivo}
          />

          {archivo && (
            <p className="hv-nota-archivo">
              Archivo seleccionado: {archivo.name}
            </p>
          )}
        </div>
      </div>

      <div className="hv-acciones-formulario">
        <button
          type="button"
          className="hv-boton-principal"
          onClick={guardarDocumento}
        >
          Cargar documento
        </button>
      </div>

      <div className="hv-lista-documentos">
        <h3>Documentos registrados</h3>

        {documentos.length === 0 ? (
          <p>No hay documentos cargados.</p>
        ) : (
          documentos.map((doc) => (
            <div key={doc.id} className="hv-documento-item">
              <div>
                <strong>{doc.nombre}</strong>
                <div>{doc.tipo}</div>

                {doc.observacion && (
                  <small>{doc.observacion}</small>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="hv-boton-secundario"
                  onClick={() =>
                    window.open(
                      doc.archivoUrl,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  Ver documento
                </button>

                <button
                  type="button"
                  className="hv-boton-cancelar"
                  onClick={() => eliminarDocumento(doc.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =====================
   MÓDULO GERENCIA
===================== */

function ModuloGerencia() {
  return (
    <div className="hv-bloque">
      <h2>Gerencia Pública</h2>
      <p>
        Esta sección queda reservada para los cargos que el sistema habilite.
        Si el usuario no tiene perfil directivo, puede permanecer deshabilitada.
      </p>
    </div>
  );
}