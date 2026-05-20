import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerHojaVidaAPI } from "../services/apiService.js";
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
              Imprimir hoja de vida
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}