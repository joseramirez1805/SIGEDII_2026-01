import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerHojaVidaAPI, actualizarHojaVidaAPI } from "../services/apiService.js";
import "../css/CertificadoSigep.css";

export default function CertificadoSigep() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [hojaVida, setHojaVida] = useState(null);

  useEffect(() => {
    const cargarHojaVida = async () => {
      try {
        setCargando(true);
        const respuesta = await obtenerHojaVidaAPI();
        setHojaVida(respuesta?.data || null);
      } catch (err) {
        setError(err?.message || "No se pudo cargar la hoja de vida");
      } finally {
        setCargando(false);
      }
    };

    cargarHojaVida();
  }, []);

  const nombreCompleto = useMemo(() => {
    const apellidos = hojaVida?.apellidos || [];
    return apellidos.length > 0 ? apellidos.join(" ") : "Sin datos";
  }, [hojaVida]);

  const formatoFecha = (valor) => {
    if (!valor) return "Sin dato";
    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime())
      ? valor
      : fecha.toLocaleDateString("es-CO", { year: "numeric", month: "2-digit", day: "2-digit" });
  };

  // Helpers para archivos
  const convertirArchivoABase64 = (archivo) =>
    new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.readAsDataURL(archivo);
      lector.onload = () => resolve(lector.result);
      lector.onerror = (err) => reject(err);
    });

  const esArchivoPDF = (archivo) => archivo?.type === "application/pdf";
  const esArchivoJPG = (archivo) => archivo?.type === "image/jpeg";

  // Modales y formularios para agregar
  const [showFormacionModal, setShowFormacionModal] = useState(false);
  const [showExperienciaModal, setShowExperienciaModal] = useState(false);

  const [formacionForm, setFormacionForm] = useState({
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
  });

  const [experienciaForm, setExperienciaForm] = useState({
    tipoInstitucion: "publico",
    nombreInstitucion: "",
    actual: false,
    cargo: "",
    fechaIngreso: "",
    fechaTerminacion: "",
    jornadaLaboral: "completa",
    motivoRetiro: "",
    ubicacion: { ciudad: "", pais: "", departamento: "", direccion: "", tipoZona: "URBANA" },
  });

  const [archivoFormacion, setArchivoFormacion] = useState(null);
  const [archivoExperiencia, setArchivoExperiencia] = useState(null);
  const [modalError, setModalError] = useState("");

  return (
    <main className="cert-page">
      <div className="cert-wrapper">

        <header className="cert-header-top">
          <div className="cert-logo">sigepII</div>

          <div className="cert-gov">
            Departamento Administrativo de la Función Pública
          </div>
        </header>

        <section className="cert-card">
          <h1 className="cert-title">Ver hoja de vida</h1>

          <p className="cert-description">
            Aquí puedes revisar la información registrada en tu hoja de vida y
            verificar los datos que ya enviaste al sistema.
          </p>

          {cargando && <div className="cert-status">Cargando hoja de vida...</div>}
          {error && <div className="cert-status cert-error">{error}</div>}

          {!cargando && !error && hojaVida && (
            <>
              <div className="cert-summary">
                <div className="cert-summary-title">Resumen general</div>
                <div className="cert-summary-grid">
                  <div className="cert-item">
                    <span className="cert-label">Nombre completo</span>
                    <div className="cert-value">{nombreCompleto}</div>
                  </div>

                  <div className="cert-item">
                    <span className="cert-label">Documento</span>
                    <div className="cert-value">
                      {hojaVida?.usuarioId?.tipoDocumento || "Sin dato"} {hojaVida?.usuarioId?.numIdentificacion || ""}
                    </div>
                  </div>

                  <div className="cert-item">
                    <span className="cert-label">Fecha de nacimiento</span>
                    <div className="cert-value">{formatoFecha(hojaVida.fechaNacimiento)}</div>
                  </div>

                  <div className="cert-item">
                    <span className="cert-label">Género</span>
                    <div className="cert-value">{hojaVida.genero || "Sin dato"}</div>
                  </div>

                  <div className="cert-item">
                    <span className="cert-label">Teléfono</span>
                    <div className="cert-value">{hojaVida?.datosContacto?.telefono || "Sin dato"}</div>
                  </div>

                  <div className="cert-item">
                    <span className="cert-label">Dirección</span>
                    <div className="cert-value">{hojaVida?.datosContacto?.direccionResidencia || "Sin dato"}</div>
                  </div>
                </div>
              </div>

              <div className="cert-section">
                <h2>Formación académica</h2>
                <div className="cert-list">
                  {(hojaVida.formacionAcademica || []).map((item, index) => (
                    <article className="cert-list-item" key={`${item.institucion}-${index}`}>
                      <strong>{item.nivelAcademico} · {item.nivelFormacion}</strong>
                      <div>{item.institucion}</div>
                      <small>{item.programaAcademico}</small>
                      <small>{item.tituloObtenido}</small>
                      <small>Grado: {formatoFecha(item.fechaGrado)}</small>
                    </article>
                  ))}
                </div>
                  <div style={{ marginTop: 12 }}>
                    <button className="cert-button secondary" onClick={() => { setShowFormacionModal(true); setModalError(""); }}>
                      Agregar formación
                    </button>
                  </div>
              </div>

              <div className="cert-section">
                <h2>Experiencia laboral</h2>
                <div className="cert-list">
                  {(hojaVida.experienciaLaboral || []).map((item, index) => (
                    <article className="cert-list-item" key={`${item.nombreInstitucion}-${index}`}>
                      <strong>{item.nombreInstitucion}</strong>
                      <div>{item.cargo}</div>
                      <small>{formatoFecha(item.fechaIngreso)} - {formatoFecha(item.fechaTerminacion)}</small>
                      <small>{item.ubicacion?.ciudad}, {item.ubicacion?.pais}</small>
                      <small>Jornada: {item.jornadaLaboral}</small>
                    </article>
                  ))}
                </div>
                  <div style={{ marginTop: 12 }}>
                    <button className="cert-button secondary" onClick={() => { setShowExperienciaModal(true); setModalError(""); }}>
                      Agregar experiencia
                    </button>
                  </div>
              </div>
            </>
          )}

          <div className="cert-actions">
            <button
              className="cert-button secondary"
              onClick={() => navigate("/panel-sigep")}
            >
              Volver al panel
            </button>

            <button
              className="cert-button primary"
              onClick={() => window.print()}
            >
              Descargar hoja de vida
            </button>
          </div>
        </section>
      </div>

      {/* MODAL FORMACIÓN */}
      {showFormacionModal && (
        <div className="cert-modal">
          <div className="cert-modal-card">
            <h3>Agregar formación académica</h3>
            {modalError && <div className="cert-status cert-error">{modalError}</div>}
            <div className="cert-form-grid">
              <div>
                <label>Nivel académico *</label>
                <select value={formacionForm.nivelAcademico} onChange={(e) => setFormacionForm((s) => ({ ...s, nivelAcademico: e.target.value }))}>
                  <option value="pregrado">pregrado</option>
                  <option value="postgrado">postgrado</option>
                </select>
              </div>

              <div>
                <label>Nivel de formación *</label>
                <select value={formacionForm.nivelFormacion} onChange={(e) => setFormacionForm((s) => ({ ...s, nivelFormacion: e.target.value }))}>
                  <option value="maestria">maestria</option>
                  <option value="doctorado">doctorado</option>
                </select>
              </div>

              <div>
                <label>Área de conocimiento *</label>
                <input value={formacionForm.areaConocimiento} onChange={(e) => setFormacionForm((s) => ({ ...s, areaConocimiento: e.target.value }))} />
              </div>

              <div>
                <label>País *</label>
                <input value={formacionForm.pais} onChange={(e) => setFormacionForm((s) => ({ ...s, pais: e.target.value }))} />
              </div>

              <div>
                <label>Institución *</label>
                <input value={formacionForm.institucion} onChange={(e) => setFormacionForm((s) => ({ ...s, institucion: e.target.value }))} />
              </div>

              <div>
                <label>Programa académico *</label>
                <input value={formacionForm.programaAcademico} onChange={(e) => setFormacionForm((s) => ({ ...s, programaAcademico: e.target.value }))} />
              </div>

              <div>
                <label>Título obtenido *</label>
                <input value={formacionForm.tituloObtenido} onChange={(e) => setFormacionForm((s) => ({ ...s, tituloObtenido: e.target.value }))} />
              </div>

              <div>
                <label>Semestres aprobados *</label>
                <input type="number" value={formacionForm.semestresAprobados} onChange={(e) => setFormacionForm((s) => ({ ...s, semestresAprobados: e.target.value }))} />
              </div>

              <div>
                <label>Estado de estudio *</label>
                <select value={formacionForm.estadoEstudio} onChange={(e) => setFormacionForm((s) => ({ ...s, estadoEstudio: e.target.value }))}>
                  <option value="finalizado">finalizado</option>
                  <option value="enProceso">enProceso</option>
                </select>
              </div>

              <div>
                <label>Fecha terminación materias *</label>
                <input type="date" value={formacionForm.fechaTerminacionMaterias} onChange={(e) => setFormacionForm((s) => ({ ...s, fechaTerminacionMaterias: e.target.value }))} />
              </div>

              <div>
                <label>Fecha de grado *</label>
                <input type="date" value={formacionForm.fechaGrado} onChange={(e) => setFormacionForm((s) => ({ ...s, fechaGrado: e.target.value }))} />
              </div>

              <div className="cert-col-full">
                <label>Soporte académico PDF *</label>
                <input type="file" accept="application/pdf" onChange={(e) => {
                  const archivo = e.target.files?.[0];
                  if (!archivo) return;
                  if (!esArchivoPDF(archivo)) { setModalError("El soporte académico debe ser un PDF."); e.target.value = ""; return; }
                  setArchivoFormacion(archivo);
                  setModalError("");
                }} />
              </div>
            </div>
            <div className="cert-modal-actions">
              <button onClick={async () => {
                // validación completa según backend
                if (
                  !formacionForm.nivelAcademico ||
                  !formacionForm.nivelFormacion ||
                  !formacionForm.areaConocimiento ||
                  !formacionForm.pais ||
                  !formacionForm.institucion ||
                  !formacionForm.programaAcademico ||
                  !formacionForm.tituloObtenido ||
                  !formacionForm.semestresAprobados ||
                  !formacionForm.estadoEstudio ||
                  !formacionForm.fechaTerminacionMaterias ||
                  !formacionForm.fechaGrado ||
                  !archivoFormacion
                ) {
                  setModalError("Completa todos los campos requeridos y adjunta el soporte.");
                  return;
                }

                try {
                  const soporteBase64 = await convertirArchivoABase64(archivoFormacion);

                  const nuevaFormacion = {
                    nivelAcademico: formacionForm.nivelAcademico,
                    nivelFormacion: formacionForm.nivelFormacion,
                    areaConocimiento: formacionForm.areaConocimiento,
                    pais: formacionForm.pais,
                    institucion: formacionForm.institucion,
                    programaAcademico: formacionForm.programaAcademico,
                    tituloObtenido: formacionForm.tituloObtenido,
                    semestresAprobados: Number(formacionForm.semestresAprobados),
                    estadoEstudio: formacionForm.estadoEstudio,
                    fechaTerminacionMaterias: new Date(formacionForm.fechaTerminacionMaterias).toISOString(),
                    fechaGrado: new Date(formacionForm.fechaGrado).toISOString(),
                    soporteNombre: archivoFormacion.name,
                    soporteBase64,
                  };

                  const nuevasFormaciones = [...(hojaVida.formacionAcademica || []), nuevaFormacion];

                  const payload = {
                    datosPersonales: {
                      apellidos: hojaVida.apellidos || [],
                      fechaNacimiento: hojaVida.fechaNacimiento,
                      genero: hojaVida.genero,
                      datosContacto: hojaVida.datosContacto,
                    },
                    formacionAcademica: [nuevaFormacion], // enviar solo los nuevos para append en backend
                  };

                  await actualizarHojaVidaAPI(payload);
                  setHojaVida((h) => ({ ...h, formacionAcademica: nuevasFormaciones }));
                  setShowFormacionModal(false);
                  setFormacionForm({ nivelAcademico: "pregrado", nivelFormacion: "maestria", areaConocimiento: "", pais: "", institucion: "", programaAcademico: "", tituloObtenido: "", semestresAprobados: "", estadoEstudio: "finalizado", fechaTerminacionMaterias: "", fechaGrado: "" });
                  setArchivoFormacion(null);
                } catch (err) {
                  setModalError(err?.message || "No se pudo guardar la formación");
                }
              }} className="cert-button primary">Guardar</button>

              <button onClick={() => { setShowFormacionModal(false); setModalError(""); }} className="cert-button secondary">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXPERIENCIA */}
      {showExperienciaModal && (
        <div className="cert-modal">
          <div className="cert-modal-card">
            <h3>Agregar experiencia laboral</h3>
            {modalError && <div className="cert-status cert-error">{modalError}</div>}
            <div className="cert-form-grid">
              <div>
                <label>Tipo de institución *</label>
                <select value={experienciaForm.tipoInstitucion} onChange={(e) => setExperienciaForm((s) => ({ ...s, tipoInstitucion: e.target.value }))}>
                  <option value="publico">publico</option>
                  <option value="privado">privado</option>
                </select>
              </div>

              <div>
                <label>Nombre institución *</label>
                <input value={experienciaForm.nombreInstitucion} onChange={(e) => setExperienciaForm((s) => ({ ...s, nombreInstitucion: e.target.value }))} />
              </div>

              <div>
                <label>Cargo *</label>
                <input value={experienciaForm.cargo} onChange={(e) => setExperienciaForm((s) => ({ ...s, cargo: e.target.value }))} />
              </div>

              <div>
                <label>Fecha de ingreso *</label>
                <input type="date" value={experienciaForm.fechaIngreso} onChange={(e) => setExperienciaForm((s) => ({ ...s, fechaIngreso: e.target.value }))} />
              </div>

              <div>
                <label>Fecha de terminación *</label>
                <input type="date" value={experienciaForm.fechaTerminacion} onChange={(e) => setExperienciaForm((s) => ({ ...s, fechaTerminacion: e.target.value }))} />
              </div>

              <div>
                <label>Jornada laboral *</label>
                <select value={experienciaForm.jornadaLaboral} onChange={(e) => setExperienciaForm((s) => ({ ...s, jornadaLaboral: e.target.value }))}>
                  <option value="completa">completa</option>
                  <option value="parcial">parcial</option>
                </select>
              </div>

              <div>
                <label>Motivo de retiro *</label>
                <input value={experienciaForm.motivoRetiro} onChange={(e) => setExperienciaForm((s) => ({ ...s, motivoRetiro: e.target.value }))} />
              </div>

              <div>
                <label>Ciudad *</label>
                <input value={experienciaForm.ubicacion.ciudad} onChange={(e) => setExperienciaForm((s) => ({ ...s, ubicacion: { ...s.ubicacion, ciudad: e.target.value } }))} />
              </div>

              <div>
                <label>País *</label>
                <input value={experienciaForm.ubicacion.pais} onChange={(e) => setExperienciaForm((s) => ({ ...s, ubicacion: { ...s.ubicacion, pais: e.target.value } }))} />
              </div>

              <div>
                <label>Departamento *</label>
                <input value={experienciaForm.ubicacion.departamento} onChange={(e) => setExperienciaForm((s) => ({ ...s, ubicacion: { ...s.ubicacion, departamento: e.target.value } }))} />
              </div>

              <div>
                <label>Tipo de zona *</label>
                <select value={experienciaForm.ubicacion.tipoZona} onChange={(e) => setExperienciaForm((s) => ({ ...s, ubicacion: { ...s.ubicacion, tipoZona: e.target.value } }))}>
                  <option value="URBANA">URBANA</option>
                  <option value="RURAL">RURAL</option>
                </select>
              </div>

              <div className="cert-col-full">
                <label>Dirección *</label>
                <input value={experienciaForm.ubicacion.direccion} onChange={(e) => setExperienciaForm((s) => ({ ...s, ubicacion: { ...s.ubicacion, direccion: e.target.value } }))} />
              </div>

              <div className="cert-col-full">
                <label>Soporte experiencia PDF o JPG *</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg" onChange={(e) => {
                  const archivo = e.target.files?.[0];
                  if (!archivo) return;
                  if (!esArchivoPDF(archivo) && !esArchivoJPG(archivo)) { setModalError("El soporte de experiencia debe ser PDF o JPG."); e.target.value = ""; return; }
                  setArchivoExperiencia(archivo);
                  setModalError("");
                }} />
              </div>
            </div>
            <div className="cert-modal-actions">
              <button onClick={async () => {
                // validación completa según backend
                if (
                  !experienciaForm.tipoInstitucion ||
                  !experienciaForm.nombreInstitucion ||
                  !experienciaForm.cargo ||
                  !experienciaForm.fechaIngreso ||
                  !experienciaForm.fechaTerminacion ||
                  !experienciaForm.jornadaLaboral ||
                  !experienciaForm.motivoRetiro ||
                  !experienciaForm.ubicacion.ciudad ||
                  !experienciaForm.ubicacion.pais ||
                  !experienciaForm.ubicacion.departamento ||
                  !experienciaForm.ubicacion.tipoZona ||
                  !experienciaForm.ubicacion.direccion ||
                  !archivoExperiencia
                ) {
                  setModalError("Completa todos los campos requeridos y adjunta el soporte.");
                  return;
                }

                try {
                  const soporteBase64 = await convertirArchivoABase64(archivoExperiencia);

                  const nuevaExperiencia = {
                    tipoInstitucion: experienciaForm.tipoInstitucion,
                    nombreInstitucion: experienciaForm.nombreInstitucion,
                    cargo: experienciaForm.cargo,
                    fechaIngreso: new Date(experienciaForm.fechaIngreso).toISOString(),
                    fechaTerminacion: new Date(experienciaForm.fechaTerminacion).toISOString(),
                    jornadaLaboral: experienciaForm.jornadaLaboral,
                    motivoRetiro: experienciaForm.motivoRetiro,
                    ubicacion: {
                      ciudad: experienciaForm.ubicacion.ciudad,
                      pais: experienciaForm.ubicacion.pais,
                      departamento: experienciaForm.ubicacion.departamento,
                      tipoZona: experienciaForm.ubicacion.tipoZona,
                      direccion: experienciaForm.ubicacion.direccion,
                    },
                    soporteNombre: archivoExperiencia.name,
                    soporteBase64,
                  };

                  const nuevasExperiencias = [...(hojaVida.experienciaLaboral || []), nuevaExperiencia];

                  const payload = {
                    datosPersonales: {
                      apellidos: hojaVida.apellidos || [],
                      fechaNacimiento: hojaVida.fechaNacimiento,
                      genero: hojaVida.genero,
                      datosContacto: hojaVida.datosContacto,
                    },
                    experienciaLaboral: [nuevaExperiencia], // enviar solo los nuevos para append en backend
                  };

                  await actualizarHojaVidaAPI(payload);
                  setHojaVida((h) => ({ ...h, experienciaLaboral: nuevasExperiencias }));
                  setShowExperienciaModal(false);
                  setExperienciaForm({ tipoInstitucion: "publico", nombreInstitucion: "", actual: false, cargo: "", fechaIngreso: "", fechaTerminacion: "", jornadaLaboral: "completa", motivoRetiro: "", ubicacion: { ciudad: "", pais: "", departamento: "", direccion: "", tipoZona: "URBANA" } });
                  setArchivoExperiencia(null);
                } catch (err) {
                  setModalError(err?.message || "No se pudo guardar la experiencia");
                }
              }} className="cert-button primary">Guardar</button>

              <button onClick={() => { setShowExperienciaModal(false); setModalError(""); }} className="cert-button secondary">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}