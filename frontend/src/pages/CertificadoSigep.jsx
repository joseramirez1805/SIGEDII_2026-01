import { useNavigate } from "react-router-dom";
import "../css/CertificadoSigep.css";

export default function CertificadoSigep() {
  const navigate = useNavigate();

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
          <h1 className="cert-title">
            Certificado de situación actual
          </h1>

          <p className="cert-description">
            Este certificado valida la información actual registrada
            en el Sistema de Información y Gestión del Empleo Público
            (SIGEP II).
          </p>

          <div className="cert-grid">

            <div className="cert-item">
              <span className="cert-label">
                Nombre completo
              </span>

              <div className="cert-value">
                Ivan Mauricio Cabezas Troyano
              </div>
            </div>

            <div className="cert-item">
              <span className="cert-label">
                Tipo de documento
              </span>

              <div className="cert-value">
                Cédula de ciudadanía
              </div>
            </div>

            <div className="cert-item">
              <span className="cert-label">
                Número de documento
              </span>

              <div className="cert-value">
                13456789
              </div>
            </div>

            <div className="cert-item">
              <span className="cert-label">
                Estado en SIGEP II
              </span>

              <div className="cert-value cert-active">
                ACTIVO
              </div>
            </div>

            <div className="cert-item">
              <span className="cert-label">
                Entidad asociada
              </span>

              <div className="cert-value">
                Universidad Autónoma de Occidente
              </div>
            </div>

            <div className="cert-item">
              <span className="cert-label">
                Fecha de generación
              </span>

              <div className="cert-value">
                17/05/2026
              </div>
            </div>

          </div>

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
              Imprimir certificado
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}