import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../css/PanelSigep.css";

const MAIN_CARDS = [
  {
    title: "Crear hoja de vida",
    subtitle: "Completa y guarda la información básica del servidor público.",
    button: "Crear hoja de vida",
    route: "/hoja-de-vida",
  },
  {
    title: "Ver hoja de vida",
    subtitle: "Revisa la hoja de vida que ya registraste en el sistema.",
    button: "Ver hoja de vida",
    route: "/certificado-sigep",
  },
];

export default function PanelSigep() {
  const navigate = useNavigate();
  const { cerrarSesion, usuario } = useAuth();
  const nombreCompletoUsuario = usuario?.nombre || "Usuario";

  return (
    <main className="ps-page">
      <header className="ps-top">
        <div className="ps-logo">sigepII</div>

        <div className="ps-gov-logo">
          <span>Función Pública</span>
        </div>

        <div className="ps-user-mini">
          <div>{nombreCompletoUsuario}</div>

          <button type="button" onClick={() => cerrarSesion()}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <section className="ps-shell ps-compact-shell">
        <header className="ps-compact-header">
          <div className="ps-user-hero">
            <span>Servidor público</span>
            <h1>{nombreCompletoUsuario}</h1>
          </div>
        </header>

        <div className="ps-cards ps-cards--compact">
          {MAIN_CARDS.map((card) => (
            <article className="ps-card" key={card.title}>
              <div className="ps-card-image" />

              <button
                type="button"
                className="ps-card-caption"
                onClick={() => navigate(card.route)}
              >
                {card.title}
              </button>

              <p>{card.subtitle}</p>

              <button
                type="button"
                className="ps-card-action"
                onClick={() => navigate(card.route)}
              >
                {card.button}
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}