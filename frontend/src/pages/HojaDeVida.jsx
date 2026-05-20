import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { crearHojaVidaAPI } from "../services/apiService.js";
import "../css/HojaDeVida.css";

const TAMANO_MAXIMO_2MB = 2 * 1024 * 1024;

const datosPersonalesIniciales = {
  apellidos: "",
  fechaNacimiento: "",
  genero: "masculino",
  datosContacto: {
    telefono: "",
    direccionResidencia: "",
    tipoResidencia: "URBANA",
  },
};

const formacionInicial = {
  nivelAcademico: "pregrado",
  nivelFormacion: "maestria",
  areaConocimiento: "",
  pais: "",
  institucion: "",
  programaAcademico: "",
  tituloObtenido: "",
  semestresAprobados: "",
  estadoEstudio: "finalizado",
  fechaTerminacionMaterias: "",
  fechaGrado: "",
  soporteNombre: "",
  soporteBase64: "",
};

const experienciaInicial = {
  tipoInstitucion: "publico",
  nombreInstitucion: "",
  actual: false,
  cargo: "",
  fechaIngreso: "",
  fechaTerminacion: "",
  jornadaLaboral: "completa",
  motivoRetiro: "",
  ubicacion: {
    ciudad: "",
    pais: "",
    departamento: "",
    tipoZona: "URBANA",
    direccion: "",
  },
  soporteNombre: "",
  soporteBase64: "",
};

function convertirArchivoABase64(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.readAsDataURL(archivo);
    lector.onload = () => resolve(lector.result);
    lector.onerror = (error) => reject(error);
  });
}

function esArchivoPDF(archivo) {
  return archivo?.type === "application/pdf";
}

function esArchivoJPG(archivo) {
  return archivo?.type === "image/jpeg";
}

function leerMensajeError(error) {
  return error?.message || "No se pudo enviar la hoja de vida";
}

export default function HojaDeVida() {
  const navigate = useNavigate();
  const { cerrarSesion } = useAuth();

  const [datosPersonales, setDatosPersonales] = useState(datosPersonalesIniciales);
  const [formacionAcademica, setFormacionAcademica] = useState(formacionInicial);
  const [experienciaLaboral, setExperienciaLaboral] = useState(experienciaInicial);
  const [archivoFormacion, setArchivoFormacion] = useState(null);
  const [archivoExperiencia, setArchivoExperiencia] = useState(null);
  const [formaciones, setFormaciones] = useState([]);
  const [experiencias, setExperiencias] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [ultimaHojaVidaId, setUltimaHojaVidaId] = useState("");

  const construirPayload = async () => {
    const [soporteFormacionBase64, soporteExperienciaBase64] = await Promise.all([
      archivoFormacion ? convertirArchivoABase64(archivoFormacion) : Promise.resolve(""),
      archivoExperiencia ? convertirArchivoABase64(archivoExperiencia) : Promise.resolve(""),
    ]);

    return {
      datosPersonales: {
        apellidos: datosPersonales.apellidos
          .split(",")
          .map((valor) => valor.trim())
          .filter(Boolean),
        fechaNacimiento: datosPersonales.fechaNacimiento,
        genero: datosPersonales.genero,
        datosContacto: {
          telefono: datosPersonales.datosContacto.telefono,
          direccionResidencia: datosPersonales.datosContacto.direccionResidencia,
          tipoResidencia: datosPersonales.datosContacto.tipoResidencia,
        },
      },
      formacionAcademica: formaciones,
      experienciaLaboral: experiencias,
    };
  };

  const validarFormulario = () => {
    if (!datosPersonales.apellidos.trim()) return "Los apellidos son obligatorios.";
    if (!datosPersonales.fechaNacimiento) return "La fecha de nacimiento es obligatoria.";
    if (!datosPersonales.genero) return "El género es obligatorio.";
    if (!datosPersonales.datosContacto.telefono) return "El teléfono es obligatorio.";
    if (!datosPersonales.datosContacto.direccionResidencia) return "La dirección de residencia es obligatoria.";

    if (formaciones.length === 0) return "Agrega al menos una formación académica.";
    if (experiencias.length === 0) return "Agrega al menos una experiencia laboral.";

    return "";
  };

  const agregarFormacion = async () => {
    if (
      !formacionAcademica.areaConocimiento ||
      !formacionAcademica.pais ||
      !formacionAcademica.institucion ||
      !formacionAcademica.programaAcademico ||
      !formacionAcademica.tituloObtenido ||
      !formacionAcademica.semestresAprobados ||
      !formacionAcademica.fechaTerminacionMaterias ||
      !formacionAcademica.fechaGrado ||
      !archivoFormacion
    ) {
      setError("Completa la formación académica antes de agregarla a la lista.");
      return;
    }

    const soporteBase64 = await convertirArchivoABase64(archivoFormacion);
    setFormaciones((listaAnterior) => [
      ...listaAnterior,
      {
        ...formacionAcademica,
        semestresAprobados: Number(formacionAcademica.semestresAprobados),
        soporteNombre: archivoFormacion.name,
        soporteBase64,
      },
    ]);
    setFormacionAcademica(formacionInicial);
    setArchivoFormacion(null);
    setError("");
  };

  const agregarExperiencia = async () => {
    if (
      !experienciaLaboral.nombreInstitucion ||
      !experienciaLaboral.cargo ||
      !experienciaLaboral.fechaIngreso ||
      (!experienciaLaboral.actual && !experienciaLaboral.fechaTerminacion) ||
      (!experienciaLaboral.actual && !experienciaLaboral.motivoRetiro) ||
      !experienciaLaboral.ubicacion.ciudad ||
      !experienciaLaboral.ubicacion.pais ||
      !experienciaLaboral.ubicacion.departamento ||
      !experienciaLaboral.ubicacion.direccion ||
      !archivoExperiencia
    ) {
      setError("Completa la experiencia laboral antes de agregarla a la lista.");
      return;
    }

    const soporteBase64 = await convertirArchivoABase64(archivoExperiencia);
    setExperiencias((listaAnterior) => [
      ...listaAnterior,
      {
        ...experienciaLaboral,
        fechaTerminacion: experienciaLaboral.actual ? experienciaLaboral.fechaIngreso : experienciaLaboral.fechaTerminacion,
        motivoRetiro: experienciaLaboral.actual ? "Actualmente laborando" : experienciaLaboral.motivoRetiro,
        ubicacion: {
          ciudad: experienciaLaboral.ubicacion.ciudad,
          pais: experienciaLaboral.ubicacion.pais,
          departamento: experienciaLaboral.ubicacion.departamento,
          tipoZona: experienciaLaboral.ubicacion.tipoZona,
          direccion: experienciaLaboral.ubicacion.direccion,
        },
        soporteNombre: archivoExperiencia.name,
        soporteBase64,
      },
    ]);
    setExperienciaLaboral(experienciaInicial);
    setArchivoExperiencia(null);
    setError("");
  };

  const manejarEnvioFinal = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setUltimaHojaVidaId("");

    const validacion = validarFormulario();
    if (validacion) {
      setError(validacion);
      return;
    }

    try {
      if (archivoFormacion && archivoFormacion.size > TAMANO_MAXIMO_2MB) {
        setError("El archivo de formación supera el límite de 2 MB.");
        return;
      }

      if (archivoExperiencia && archivoExperiencia.size > TAMANO_MAXIMO_2MB) {
        setError("El archivo de experiencia supera el límite de 2 MB.");
        return;
      }

      setEnviando(true);
      const payload = await construirPayload();
      const respuesta = await crearHojaVidaAPI(payload);
      const idGuardado = respuesta?.data?._id || respuesta?.data?.id || "";

      setUltimaHojaVidaId(idGuardado);
      setMensaje(
        idGuardado
          ? `${respuesta.message || "Hoja de vida guardada correctamente"}. ID: ${idGuardado}`
          : respuesta.message || "Hoja de vida guardada correctamente"
      );
    } catch (err) {
      setError(leerMensajeError(err));
    } finally {
      setEnviando(false);
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
          <button type="button" onClick={() => cerrarSesion()}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <form className="hv-contenedor" onSubmit={manejarEnvioFinal}>
        <h1>Hoja de vida</h1>

        {error && <div className="login-error">{error}</div>}
        {mensaje && (
          <div className="login-success hv-mensaje-exito">
            <strong>Hoja de vida guardada correctamente.</strong>
            <span>{mensaje}</span>
            {ultimaHojaVidaId && <small>ID de registro: {ultimaHojaVidaId}</small>}
          </div>
        )}

        <section className="hv-bloque">
          <h2>Datos personales</h2>
          <div className="hv-form-grid">
            <div>
              <label>Apellidos *</label>
              <input
                type="text"
                value={datosPersonales.apellidos}
                onChange={(e) => setDatosPersonales((estadoAnterior) => ({ ...estadoAnterior, apellidos: e.target.value }))}
                placeholder="García, López"
              />
            </div>
            <div>
              <label>Fecha de nacimiento *</label>
              <input
                type="date"
                value={datosPersonales.fechaNacimiento}
                onChange={(e) => setDatosPersonales((estadoAnterior) => ({ ...estadoAnterior, fechaNacimiento: e.target.value }))}
              />
            </div>
            <div>
              <label>Género *</label>
              <select
                value={datosPersonales.genero}
                onChange={(e) => setDatosPersonales((estadoAnterior) => ({ ...estadoAnterior, genero: e.target.value }))}
              >
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label>Teléfono *</label>
              <input
                type="text"
                value={datosPersonales.datosContacto.telefono}
                onChange={(e) =>
                  setDatosPersonales((estadoAnterior) => ({
                    ...estadoAnterior,
                    datosContacto: {
                      ...estadoAnterior.datosContacto,
                      telefono: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label>Dirección de residencia *</label>
              <input
                type="text"
                value={datosPersonales.datosContacto.direccionResidencia}
                onChange={(e) =>
                  setDatosPersonales((estadoAnterior) => ({
                    ...estadoAnterior,
                    datosContacto: {
                      ...estadoAnterior.datosContacto,
                      direccionResidencia: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label>Tipo de residencia</label>
              <select
                value={datosPersonales.datosContacto.tipoResidencia}
                onChange={(e) =>
                  setDatosPersonales((estadoAnterior) => ({
                    ...estadoAnterior,
                    datosContacto: {
                      ...estadoAnterior.datosContacto,
                      tipoResidencia: e.target.value,
                    },
                  }))
                }
              >
                <option value="URBANA">URBANA</option>
                <option value="RURAL">RURAL</option>
              </select>
            </div>
          </div>
        </section>

        <section className="hv-bloque">
          <h2>Formación académica</h2>
          <div className="hv-consejo-formulario">
            Puedes agregar varias formaciones. Cada vez que pulses agregar, quedará una nueva entrada para enviar al final.
          </div>
          <div className="hv-form-grid">
            <div>
              <label>Nivel académico *</label>
              <select
                value={formacionAcademica.nivelAcademico}
                onChange={(e) => setFormacionAcademica((estadoAnterior) => ({ ...estadoAnterior, nivelAcademico: e.target.value }))}
              >
                <option value="pregrado">pregrado</option>
                <option value="postgrado">postgrado</option>
              </select>
            </div>
            <div>
              <label>Nivel de formación *</label>
              <select
                value={formacionAcademica.nivelFormacion}
                onChange={(e) => setFormacionAcademica((estadoAnterior) => ({ ...estadoAnterior, nivelFormacion: e.target.value }))}
              >
                <option value="maestria">maestria</option>
                <option value="doctorado">doctorado</option>
              </select>
            </div>
            <div>
              <label>Área de conocimiento *</label>
              <input
                type="text"
                value={formacionAcademica.areaConocimiento}
                onChange={(e) => setFormacionAcademica((estadoAnterior) => ({ ...estadoAnterior, areaConocimiento: e.target.value }))}
              />
            </div>
            <div>
              <label>País *</label>
              <input
                type="text"
                value={formacionAcademica.pais}
                onChange={(e) => setFormacionAcademica((estadoAnterior) => ({ ...estadoAnterior, pais: e.target.value }))}
              />
            </div>
            <div>
              <label>Institución *</label>
              <input
                type="text"
                value={formacionAcademica.institucion}
                onChange={(e) => setFormacionAcademica((estadoAnterior) => ({ ...estadoAnterior, institucion: e.target.value }))}
              />
            </div>
            <div>
              <label>Programa académico *</label>
              <input
                type="text"
                value={formacionAcademica.programaAcademico}
                onChange={(e) => setFormacionAcademica((estadoAnterior) => ({ ...estadoAnterior, programaAcademico: e.target.value }))}
              />
            </div>
            <div>
              <label>Título obtenido *</label>
              <input
                type="text"
                value={formacionAcademica.tituloObtenido}
                onChange={(e) => setFormacionAcademica((estadoAnterior) => ({ ...estadoAnterior, tituloObtenido: e.target.value }))}
              />
            </div>
            <div>
              <label>Semestres aprobados *</label>
              <input
                type="number"
                value={formacionAcademica.semestresAprobados}
                onChange={(e) => setFormacionAcademica((estadoAnterior) => ({ ...estadoAnterior, semestresAprobados: e.target.value }))}
              />
            </div>
            <div>
              <label>Estado de estudio *</label>
              <select
                value={formacionAcademica.estadoEstudio}
                onChange={(e) => setFormacionAcademica((estadoAnterior) => ({ ...estadoAnterior, estadoEstudio: e.target.value }))}
              >
                <option value="finalizado">finalizado</option>
                <option value="enProceso">enProceso</option>
              </select>
            </div>
            <div>
              <label>Fecha terminación materias *</label>
              <input
                type="date"
                value={formacionAcademica.fechaTerminacionMaterias}
                onChange={(e) => setFormacionAcademica((estadoAnterior) => ({ ...estadoAnterior, fechaTerminacionMaterias: e.target.value }))}
              />
            </div>
            <div>
              <label>Fecha de grado *</label>
              <input
                type="date"
                value={formacionAcademica.fechaGrado}
                onChange={(e) => setFormacionAcademica((estadoAnterior) => ({ ...estadoAnterior, fechaGrado: e.target.value }))}
              />
            </div>
            <div className="hv-columna-completa">
              <label>Soporte académico PDF *</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const archivo = e.target.files?.[0];
                  if (!archivo) return;
                  if (!esArchivoPDF(archivo)) {
                    setError("El soporte académico debe ser un PDF.");
                    e.target.value = "";
                    return;
                  }
                  if (archivo.size > TAMANO_MAXIMO_2MB) {
                    setError("El archivo de formación supera el límite de 2 MB.");
                    e.target.value = "";
                    return;
                  }
                  setError("");
                  setArchivoFormacion(archivo);
                }}
              />
            </div>
          </div>

          <div className="hv-acciones-formulario">
            <button type="button" className="hv-boton-secundario" onClick={agregarFormacion}>
              Agregar formación
            </button>
          </div>

          {formaciones.length > 0 && (
            <div className="hv-lista-documentos">
              <h3>Formaciones agregadas</h3>
              {formaciones.map((item, index) => (
                <div key={`${item.institucion}-${index}`} className="hv-documento-item">
                  <div>
                    <strong>{item.institucion}</strong>
                    <div>{item.programaAcademico}</div>
                    <small>{item.nivelAcademico} · {item.nivelFormacion}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="hv-bloque">
          <h2>Experiencia laboral</h2>
          <div className="hv-consejo-formulario">
            Si actualmente sigue trabajando en el cargo, marca la casilla y no tendrás que completar fecha de terminación ni motivo de retiro.
            También puedes agregar varias experiencias antes de enviar.
          </div>
          <div className="hv-form-grid">
            <div>
              <label>Tipo de institución *</label>
              <select
                value={experienciaLaboral.tipoInstitucion}
                onChange={(e) => setExperienciaLaboral((estadoAnterior) => ({ ...estadoAnterior, tipoInstitucion: e.target.value }))}
              >
                <option value="publico">publico</option>
                <option value="privado">privado</option>
              </select>
            </div>
            <div>
              <label>Nombre de institución *</label>
              <input
                type="text"
                value={experienciaLaboral.nombreInstitucion}
                onChange={(e) => setExperienciaLaboral((estadoAnterior) => ({ ...estadoAnterior, nombreInstitucion: e.target.value }))}
              />
            </div>
            <div>
              <label>Cargo *</label>
              <input
                type="text"
                value={experienciaLaboral.cargo}
                onChange={(e) => setExperienciaLaboral((estadoAnterior) => ({ ...estadoAnterior, cargo: e.target.value }))}
              />
            </div>
            <div>
              <label>Fecha de ingreso *</label>
              <input
                type="date"
                value={experienciaLaboral.fechaIngreso}
                onChange={(e) => setExperienciaLaboral((estadoAnterior) => ({ ...estadoAnterior, fechaIngreso: e.target.value }))}
              />
            </div>
            <div className="hv-columna-completa hv-toggle-card">
              <label className="hv-checkbox">
                <input
                  type="checkbox"
                  checked={experienciaLaboral.actual}
                  onChange={(e) =>
                    setExperienciaLaboral((estadoAnterior) => ({
                      ...estadoAnterior,
                      actual: e.target.checked,
                    }))
                  }
                />
                <span>Actualmente estoy trabajando aquí</span>
              </label>
            </div>
            {!experienciaLaboral.actual && (
              <>
                <div>
                  <label>Fecha de terminación *</label>
                  <input
                    type="date"
                    value={experienciaLaboral.fechaTerminacion}
                    onChange={(e) => setExperienciaLaboral((estadoAnterior) => ({ ...estadoAnterior, fechaTerminacion: e.target.value }))}
                  />
                </div>
                <div>
                  <label>Motivo de retiro *</label>
                  <input
                    type="text"
                    value={experienciaLaboral.motivoRetiro}
                    onChange={(e) => setExperienciaLaboral((estadoAnterior) => ({ ...estadoAnterior, motivoRetiro: e.target.value }))}
                  />
                </div>
              </>
            )}
            <div>
              <label>Jornada laboral *</label>
              <select
                value={experienciaLaboral.jornadaLaboral}
                onChange={(e) => setExperienciaLaboral((estadoAnterior) => ({ ...estadoAnterior, jornadaLaboral: e.target.value }))}
              >
                <option value="completa">completa</option>
                <option value="parcial">parcial</option>
              </select>
            </div>
            <div>
              <label>Ciudad *</label>
              <input
                type="text"
                value={experienciaLaboral.ubicacion.ciudad}
                onChange={(e) =>
                  setExperienciaLaboral((estadoAnterior) => ({
                    ...estadoAnterior,
                    ubicacion: {
                      ...estadoAnterior.ubicacion,
                      ciudad: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label>País *</label>
              <input
                type="text"
                value={experienciaLaboral.ubicacion.pais}
                onChange={(e) =>
                  setExperienciaLaboral((estadoAnterior) => ({
                    ...estadoAnterior,
                    ubicacion: {
                      ...estadoAnterior.ubicacion,
                      pais: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label>Departamento *</label>
              <input
                type="text"
                value={experienciaLaboral.ubicacion.departamento}
                onChange={(e) =>
                  setExperienciaLaboral((estadoAnterior) => ({
                    ...estadoAnterior,
                    ubicacion: {
                      ...estadoAnterior.ubicacion,
                      departamento: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label>Tipo de zona *</label>
              <select
                value={experienciaLaboral.ubicacion.tipoZona}
                onChange={(e) =>
                  setExperienciaLaboral((estadoAnterior) => ({
                    ...estadoAnterior,
                    ubicacion: {
                      ...estadoAnterior.ubicacion,
                      tipoZona: e.target.value,
                    },
                  }))
                }
              >
                <option value="URBANA">URBANA</option>
                <option value="RURAL">RURAL</option>
              </select>
            </div>
            <div className="hv-columna-completa">
              <label>Dirección *</label>
              <input
                type="text"
                value={experienciaLaboral.ubicacion.direccion}
                onChange={(e) =>
                  setExperienciaLaboral((estadoAnterior) => ({
                    ...estadoAnterior,
                    ubicacion: {
                      ...estadoAnterior.ubicacion,
                      direccion: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="hv-columna-completa">
              <label>Soporte de experiencia PDF o JPG *</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg"
                onChange={(e) => {
                  const archivo = e.target.files?.[0];
                  if (!archivo) return;
                  if (!esArchivoPDF(archivo) && !esArchivoJPG(archivo)) {
                    setError("El soporte de experiencia debe ser PDF o JPG.");
                    e.target.value = "";
                    return;
                  }
                  if (archivo.size > TAMANO_MAXIMO_2MB) {
                    setError("El archivo de experiencia supera el límite de 2 MB.");
                    e.target.value = "";
                    return;
                  }
                  setError("");
                  setArchivoExperiencia(archivo);
                }}
              />
            </div>
          </div>

          <div className="hv-acciones-formulario">
            <button type="button" className="hv-boton-secundario" onClick={agregarExperiencia}>
              Agregar experiencia
            </button>
          </div>

          {experiencias.length > 0 && (
            <div className="hv-lista-documentos">
              <h3>Experiencias agregadas</h3>
              {experiencias.map((item, index) => (
                <div key={`${item.nombreInstitucion}-${index}`} className="hv-documento-item">
                  <div>
                    <strong>{item.nombreInstitucion}</strong>
                    <div>{item.cargo}</div>
                    <small>{item.actual ? "Actualmente laborando" : `${item.fechaIngreso} - ${item.fechaTerminacion}`}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="hv-bloque">
          <button type="submit" className="hv-boton-enviar" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar hoja de vida"}
          </button>
        </section>

        <div className="hv-footer" style={{ marginTop: 24 }}>
          <button type="button" className="hv-boton-volver" onClick={() => navigate("/panel-sigep")}>
            ← Volver al panel
          </button>
        </div>
      </form>
    </div>
  );
}