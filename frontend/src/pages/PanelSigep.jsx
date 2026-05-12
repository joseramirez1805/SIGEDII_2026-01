import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../css/PanelSigep.css";

const MAIN_CARDS = [
  {
    title: "Mi Hoja de Vida",
    subtitle: "Accede al perfil y gestiona la información básica del servidor público.",
    button: "Abrir hoja de vida",
    route: "/hoja-de-vida",
  },
  {
    title: "Certificado de situación actual en SIGEP II",
    subtitle: "Revisa el estado actual de tu registro dentro del sistema.",
    button: "Abrir certificado",
    route: "/hoja-de-vida",
  },
];

const SIDEBAR_ACTIONS = ["Imprimir Mi Hoja De Vida", "Descargar Mi Hoja De Vida"];
const HELP_LINKS = ["Preguntas frecuentes", "Manual de Usuario"];

function SigepLogo() {
  return <div className="ps-logo">sigepII</div>;
}

function GovLogo() {
  return (
    <div className="ps-gov-logo">
      <span>Función Pública</span>
    </div>
  );
}

export default function PanelSigep() {
  const navigate = useNavigate();
  const { cerrarSesion } = useAuth();

  return (
    <main className="ps-page">
      <section className="ps-shell">
        <header className="ps-top">
          <SigepLogo />
          <GovLogo />

          <div className="ps-user-mini">
            <div>Ivan Mauricio Cabezas Troyano</div>
            <button type="button" onClick={() => cerrarSesion()}>
              Cerrar Sesión
            </button>
          </div>
        </header>

        <nav className="ps-tabs" aria-label="Navegación del sistema">
          <button type="button" className="ps-tab active">Administración</button>
          <button type="button" className="ps-tab">Información Personal</button>
          <button type="button" className="ps-tab">Cambiar Contraseña</button>
        </nav>

        <div className="ps-grid">
          <div className="ps-main">
            <div className="ps-cards">
              {MAIN_CARDS.map((card) => (
                <article className="ps-card" key={card.title}>
                  <div className="ps-card-image" />
                  <button type="button" className="ps-card-caption" onClick={() => navigate(card.route)}>
                    {card.title}
                  </button>
                  <p>{card.subtitle}</p>
                  <button type="button" className="ps-card-action" onClick={() => navigate(card.route)}>
                    {card.button}
                  </button>
                </article>
              ))}
            </div>
          </div>

          <aside className="ps-sidebar">
            <div className="ps-user-box">
              <strong>Usuario</strong>
              <span>Ivan Mauricio Cabezas Troyano</span>
            </div>

            {SIDEBAR_ACTIONS.map((action) => (
              <button key={action} type="button" className="ps-sidebar-button" onClick={() => navigate("/hoja-de-vida")}>
                {action}
              </button>
            ))}

            <div className="ps-entity-box">
              <strong>Entidades Asociadas a Mi Usuario</strong>
              <div className="ps-select">6242 - UNIVERSID ▾</div>
            </div>

            <div className="ps-help-box">
              <strong>Otras Opciones</strong>
              {HELP_LINKS.map((link) => (
                <button key={link} type="button" className="ps-help-link">
                  {link}
                </button>
              ))}
            </div>

            <div className="ps-video-box">
              <strong>Video Tutorial</strong>
              <div className="ps-screen">sigepII</div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}