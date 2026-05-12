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

export default function HojaDeVida() {
  const [moduloActual, setModuloActual] = useState("datos");
  const [submodulo, setSubmodulo] = useState("basicos");
  const navigate = useNavigate();
  const { cerrarSesion } = useAuth();

  const renderizarContenido = () => {
    switch (moduloActual) {
      case "datos":
        return <ModuloDatos submodulo={submodulo} setSubmodulo={setSubmodulo} />;
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
      {/* Header */}
      <header className="hv-header">
        <div className="hv-header-left">
          <div className="hv-logo">sigepII</div>
          <div className="hv-titulo-principal">Función Pública</div>
        </div>
        <div className="hv-header-right">
          <span>Ivan Mauricio Cabezas Troyano</span>
          <button onClick={() => cerrarSesion()}>Cerrar sesión</button>
        </div>
      </header>

      {/* Navegación principal */}
      <nav className="hv-nav-principal">
        {MODULOS.map((mod) => (
          <button
            key={mod.id}
            className={`hv-tab ${moduloActual === mod.id ? "activo" : ""}`}
            onClick={() => {
              setModuloActual(mod.id);
              setSubmodulo("basicos");
            }}
          >
            {mod.titulo}
          </button>
        ))}
      </nav>

      {/* Contenido */}
      <div className="hv-contenedor">
        <h1>{MODULOS.find(m => m.id === moduloActual)?.titulo}</h1>
        {renderizarContenido()}
      </div>

      {/* Footer */}
      <footer className="hv-footer">
        <button className="hv-boton-volver" onClick={() => navigate("/panel-sigep")}>
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
          className={`hv-subtab ${submodulo === "basicos" ? "activo" : ""}`}
          onClick={() => setSubmodulo("basicos")}
        >
          Datos Básicos
        </button>
        <button
          className={`hv-subtab ${submodulo === "demograficos" ? "activo" : ""}`}
          onClick={() => setSubmodulo("demograficos")}
        >
          Datos Demográficos
        </button>
        <button
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
                <label>Número de Identificación</label>
                <input type="text" value={datosBasicos.numeroDoc} readOnly />
              </div>
              <div className="hv-campo">
                <label>Correo Electrónico</label>
                <input type="email" value={datosBasicos.correo} readOnly />
              </div>
            </div>
            <div className="hv-acciones">
              <button className="hv-boton-guardar">Guardar</button>
              <button className="hv-boton-cancelar">Cancelar</button>
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
                <label>Fecha de Nacimiento</label>
                <input type="date" defaultValue="1972-01-30" />
              </div>
              <div className="hv-campo">
                <label>Estado Civil</label>
                <select defaultValue="CASADO">
                  <option>SOLTERO</option>
                  <option>CASADO</option>
                  <option>DIVORCIADO</option>
                </select>
              </div>
              <div className="hv-campo">
                <label>Nacionalidad</label>
                <input type="text" value="COLOMBIANA" readOnly />
              </div>
            </div>
            <div className="hv-acciones">
              <button className="hv-boton-guardar">Guardar</button>
              <button className="hv-boton-cancelar">Cancelar</button>
            </div>
          </div>
        )}

        {submodulo === "contacto" && (
          <div className="hv-seccion">
            <h3>Datos de Contacto</h3>
            <div className="hv-grid-2">
              <div className="hv-campo">
                <label>Teléfono Móvil</label>
                <input type="tel" defaultValue="3015234567" />
              </div>
              <div className="hv-campo">
                <label>Teléfono Fijo</label>
                <input type="tel" defaultValue="6017395656" />
              </div>
              <div className="hv-campo">
                <label>Dirección</label>
                <input type="text" defaultValue="Calle 22 No. 45-67" />
              </div>
              <div className="hv-campo">
                <label>Ciudad</label>
                <input type="text" defaultValue="Bogotá" />
              </div>
            </div>
            <div className="hv-acciones">
              <button className="hv-boton-guardar">Guardar</button>
              <button className="hv-boton-cancelar">Cancelar</button>
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
  const [educacion] = useState([
    {
      institucion: "UNIVERSIDAD DEL VALLE",
      nivel: "PREGRADO",
      area: "INGENIERÍA, ARQUITECTURA, URBANISMO Y AFINES",
      pais: "COLOMBIA",
      fecha: "19/02/2001 - 28/26/2004",
    },
  ]);

  return (
    <div className="hv-modulo">
      <div className="hv-tabla-contenedor">
        <table className="hv-tabla">
          <thead>
            <tr>
              <th>Institución Educativa</th>
              <th>Nivel Académico</th>
              <th>Área de Conocimiento</th>
              <th>País</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {educacion.map((edu, i) => (
              <tr key={i}>
                <td>{edu.institucion}</td>
                <td>{edu.nivel}</td>
                <td>{edu.area}</td>
                <td>{edu.pais}</td>
                <td>{edu.fecha}</td>
                <td className="hv-acciones-tabla">
                  <button title="Ver">👁️</button>
                  <button title="Editar">✏️</button>
                  <button title="Eliminar">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="hv-boton-agregar">+ Agregar Nuevo</button>
    </div>
  );
}

/* =====================
   MÓDULO EXPERIENCIA LABORAL
===================== */

function ModuloExperiencia() {
  const [experiencia] = useState([
    {
      institucion: "UNIVERSIDAD AUTÓNOMA",
      nivel: "PREGRADO",
      area: "INGENIERÍA, ARQUITECTURA, URBANISMO Y AFINES",
      pais: "COLOMBIA",
      fecha: "25/06/2024 - 28/11/2025",
    },
    {
      institucion: "UNIVERSIDAD DE SAN BUENAVENTURA CALI",
      nivel: "PREGRADO",
      area: "INGENIERÍA, ARQUITECTURA, URBANISMO Y AFINES",
      pais: "COLOMBIA",
      fecha: "06/02/2024",
    },
  ]);

  return (
    <div className="hv-modulo">
      <div className="hv-tabla-contenedor">
        <table className="hv-tabla">
          <thead>
            <tr>
              <th>Institución</th>
              <th>Nivel Académico</th>
              <th>Área de Conocimiento</th>
              <th>País</th>
              <th>Fecha Inicio - Fecha Fin</th>
              <th>Verificado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {experiencia.map((exp, i) => (
              <tr key={i}>
                <td>{exp.institucion}</td>
                <td>{exp.nivel}</td>
                <td>{exp.area}</td>
                <td>{exp.pais}</td>
                <td>{exp.fecha}</td>
                <td>
                  <input type="checkbox" />
                </td>
                <td className="hv-acciones-tabla">
                  <button title="Ver">👁️</button>
                  <button title="Editar">✏️</button>
                  <button title="Eliminar">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="hv-boton-agregar">+ Agregar Nuevo</button>
    </div>
  );
}

/* =====================
   MÓDULO DOCENCIA
===================== */

function ModuloDocencia() {
  return (
    <div className="hv-modulo">
      <div className="hv-tabla-contenedor">
        <table className="hv-tabla">
          <thead>
            <tr>
              <th>Institución Educativa</th>
              <th>Nivel Académico</th>
              <th>Área de Conocimiento</th>
              <th>País</th>
              <th>Fecha Inicio - Fecha Fin</th>
              <th>Verificado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                No hay registros
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="hv-boton-agregar">+ Agregar Nuevo</button>
    </div>
  );
}

/* =====================
   MÓDULO DOCUMENTOS
===================== */

function ModuloDocumentos() {
  return (
    <div className="hv-modulo">
      <p style={{ padding: "20px", color: "#666" }}>
        Aquí puedes adjuntar documentos adicionales como certificados o credenciales.
      </p>
      <div className="hv-carga-documentos">
        <input type="file" multiple />
        <button className="hv-boton-cargar">Cargar Documentos</button>
      </div>
    </div>
  );
}

/* =====================
   MÓDULO GERENCIA
===================== */

function ModuloGerencia() {
  return (
    <div className="hv-modulo">
      <p style={{ padding: "20px", color: "#666" }}>
        Esta sección está disponible para servidores públicos con responsabilidades de gerencia pública.
      </p>
    </div>
  );
}