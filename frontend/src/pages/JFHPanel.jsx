import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../css/JFHPanel.css";
import FormularioServidorPublico from "../components/FormularioServidorPublico.jsx";

export default function JFHPanel() {
  const navigate = useNavigate();
  const { cerrarSesion, usuario } = useAuth();
  const [servidoresPublicos, setServidoresPublicos] = useState(() => {
    const guardados = localStorage.getItem("sigep-servidores-publicos");
    return guardados ? JSON.parse(guardados) : [];
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const guardarServidoresPublicos = (servidores) => {
    localStorage.setItem("sigep-servidores-publicos", JSON.stringify(servidores));
  };

  const manejarAgregarServidor = async (nuevoServidor) => {
    if (editandoId) {
      const actualizados = servidoresPublicos.map((s) =>
        s.id === editandoId ? { ...nuevoServidor, id: editandoId } : s
      );
      setServidoresPublicos(actualizados);
      guardarServidoresPublicos(actualizados);
      setEditandoId(null);
      setMostrarFormulario(false);
      return;
    }

    // Crear en backend usando el endpoint registrarUsuario
    try {
      // Mapear tipo de documento al formato del backend
      const tipoMap = {
        CC: "cedulaCiudadania",
        CE: "cedulaExtranjera",
        TI: "tarjetaIdentidad",
        PA: "pasaporte",
      };

      const payload = {
        tipoDocumento: tipoMap[nuevoServidor.tipoDocumento] || nuevoServidor.tipoDocumento,
        numIdentificacion: nuevoServidor.numeroIdentificacion,
        contrasena: nuevoServidor.contrasena,
        nombres: [nuevoServidor.nombre],
        email: nuevoServidor.correo,
      };

      // Import dinámico para evitar ciclos de import
      const { registrarUsuarioAPI } = await import("../services/apiService.js");

      const creado = await registrarUsuarioAPI(payload);

      // Añadir al estado local con la información creada
      const servidor = {
        tipoDocumento: nuevoServidor.tipoDocumento,
        numeroIdentificacion: creado.numIdentificacion || nuevoServidor.numeroIdentificacion,
        nombre: creado.nombres ? creado.nombres.join(" ") : nuevoServidor.nombre,
        correo: creado.email || nuevoServidor.correo,
        id: Date.now(),
        fechaCreacion: new Date().toLocaleDateString("es-CO"),
      };

      const actualizados = [...servidoresPublicos, servidor];
      setServidoresPublicos(actualizados);
      guardarServidoresPublicos(actualizados);

      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error creando servidor público:", error);
      alert(error.message || "Error al crear servidor público");
    }
  };

  const manejarEditarServidor = (servidor) => {
    setEditandoId(servidor.id);
    setMostrarFormulario(true);
  };

  const manejarEliminarServidor = (id) => {
    if (confirm("¿Está seguro de que desea eliminar este servidor público?")) {
      const actualizados = servidoresPublicos.filter((s) => s.id !== id);
      setServidoresPublicos(actualizados);
      guardarServidoresPublicos(actualizados);
    }
  };

  const servidorEditando =
    editandoId && servidoresPublicos.find((s) => s.id === editandoId);

  const manejarCancelarFormulario = () => {
    setMostrarFormulario(false);
    setEditandoId(null);
  };

  return (
    <main className="jfh-page">
      <section className="jfh-shell">
        {/* HEADER */}
        <header className="jfh-header">
          <div className="jfh-logo">
            <span>SIGEP II</span>
            <span className="jfh-badge">JFH</span>
          </div>

          <div className="jfh-gov-logo">
            <span>Función Pública</span>
          </div>

          <div className="jfh-user-section">
            <div className="jfh-user-info">
              <div className="jfh-user-name">{usuario?.nombre || "Usuario JFH"}</div>
              <div className="jfh-user-role">Gestor de Servidores Públicos</div>
            </div>
            <button
              type="button"
              className="jfh-logout-btn"
              onClick={() => {
                cerrarSesion();
                navigate("/login");
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <div className="jfh-content">
          <div className="jfh-main">
            {/* TÍTULO Y BOTÓN */}
            <div className="jfh-title-section">
              <div>
                <h1>Gestión de Servidores Públicos</h1>
                <p>Crear, editar y administrar servidores públicos del sistema</p>
              </div>
              <button
                type="button"
                className="jfh-btn-primary"
                onClick={() => {
                  setEditandoId(null);
                  setMostrarFormulario(true);
                }}
              >
                ➕ Crear Servidor Público
              </button>
            </div>

            {/* FORMULARIO */}
            {mostrarFormulario && (
              <div className="jfh-formulario-container">
                <FormularioServidorPublico
                  onGuardar={manejarAgregarServidor}
                  onCancelar={manejarCancelarFormulario}
                  servidorInicial={servidorEditando}
                  esEdicion={!!editandoId}
                />
              </div>
            )}

            {/* TABLA DE SERVIDORES */}
            <div className="jfh-tabla-contenedor">
              <h2>Servidores Públicos Registrados ({servidoresPublicos.length})</h2>

              {servidoresPublicos.length === 0 ? (
                <div className="jfh-sin-datos">
                  <p>No hay servidores públicos registrados aún.</p>
                  <p className="jfh-sin-datos-sub">
                    Haz clic en "Crear Servidor Público" para agregar uno.
                  </p>
                </div>
              ) : (
                <table className="jfh-tabla">
                  <thead>
                    <tr>
                      <th>Tipo Doc.</th>
                      <th>Número Identificación</th>
                      <th>Nombre</th>
                      <th>Correo Electrónico</th>
                      <th>Fecha de Creación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servidoresPublicos.map((servidor) => (
                      <tr key={servidor.id}>
                        <td>{servidor.tipoDocumento}</td>
                        <td>{servidor.numeroIdentificacion}</td>
                        <td>{servidor.nombre}</td>
                        <td>{servidor.correo}</td>
                        <td>{servidor.fechaCreacion}</td>
                        <td className="jfh-tabla-acciones">
                          <button
                            type="button"
                            className="jfh-btn-editar"
                            onClick={() => manejarEditarServidor(servidor)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="jfh-btn-eliminar"
                            onClick={() => manejarEliminarServidor(servidor.id)}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="jfh-sidebar">
            <div className="jfh-info-box">
              <h3>Información del Gestor</h3>
              <div className="jfh-info-item">
                <strong>Nombre:</strong>
                <span>{usuario?.nombre || "N/A"}</span>
              </div>
              <div className="jfh-info-item">
                <strong>Documento:</strong>
                <span>{usuario?.numeroDocumento || "N/A"}</span>
              </div>
              <div className="jfh-info-item">
                <strong>Correo:</strong>
                <span>{usuario?.correo || "N/A"}</span>
              </div>
            </div>

            <div className="jfh-estadisticas">
              <h3>Estadísticas</h3>
              <div className="jfh-stat">
                <div className="jfh-stat-numero">{servidoresPublicos.length}</div>
                <div className="jfh-stat-label">Servidores Creados</div>
              </div>
            </div>

            <div className="jfh-ayuda">
              <h3>Ayuda Rápida</h3>
              <ul>
                <li>Selecciona el tipo de documento (CC, CE, TI, PA)</li>
                <li>Número de ID mínimo 6 dígitos</li>
                <li>Nombre completo del servidor público</li>
                <li>Correo válido para notificaciones</li>
                <li>Contraseña mínimo 8 caracteres</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
