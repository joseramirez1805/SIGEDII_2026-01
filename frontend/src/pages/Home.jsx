import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

const SLIDES = [
  {
    title: "Información Importante",
    text: "Debido a la alta concurrencia de usuarios, la funcionalidad de restablecimiento de contraseñas en SIGEP II presenta retrasos en la llegada del correo. Si pasados 30 minutos el correo no llega, comuníquese con la Oficina de Relación Estado Ciudadanías al PBX 6017395656 opción 2, indicando el asunto \"Restablecimiento de contraseña\".",
  },
  {
    title: "Actualiza tu Hoja de Vida",
    text: "Recuerda mantener actualizada tu hoja de vida en SIGEP II. Esto es fundamental para los procesos de selección y evaluación en el Estado Colombiano.",
  },
  {
    title: "Nuevo módulo disponible",
    text: "Ya se encuentra disponible el nuevo módulo de comisiones y encargos. Consulta el instructivo en la sección de Instructivos y Formatos.",
  },
];

const NAV_ITEMS = [
  { label: "SIGEP II", active: true },
  { label: "¿Qué es?" },
  { label: "Directorios ▾" },
  { label: "Cifras ▾" },
  { label: "Instructivos y Formatos" },
  { label: "Preguntas Frecuentes" },
  { label: "Ingresar" },
];

const CARDS = [
  { icon: "📋", title: "Hoja de Vida", desc: "Actualiza y gestiona tu hoja de vida en el sistema de empleo público colombiano." },
  { icon: "📁", title: "Directorios", desc: "Consulta los directorios de servidores públicos y entidades del Estado." },
  { icon: "📊", title: "Cifras", desc: "Estadísticas y datos sobre el empleo público en Colombia." },
  { icon: "❓", title: "Preguntas Frecuentes", desc: "Encuentra respuestas a las dudas más comunes sobre SIGEP II." },
];

function ShieldLogo() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <path d="M22 3L5 10v12c0 9.5 7.2 18.4 17 21 9.8-2.6 17-11.5 17-21V10L22 3z" fill="#1a4e8c"/>
      <path d="M22 3L5 10v12c0 9.5 7.2 18.4 17 21 9.8-2.6 17-11.5 17-21V10L22 3z"
        fill="none" stroke="#f5a623" strokeWidth="1.5"/>
      <text x="22" y="27" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">CO</text>
    </svg>
  );
}

export default function SigepII() {
  const [slide, setSlide] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();

  const prev = () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setSlide((s) => (s + 1) % SLIDES.length);

  return (
    <div className="sigep-root">

      {/* Top Bar */}
      <div className="top-bar">
        <span className="gov-logo">GOV.CO</span>
        <div className="top-bar-right">
          <button>Seleccionar idioma ▾</button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            INGRESAR A LA INTRANET
          </a>
          <a href="#">A+</a>
          <a href="#">A-</a>
          <button>⟳</button>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <ShieldLogo />
          <div className="brand-name">Función Pública</div>
        </div>
        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a href="#" className={item.active ? "active" : ""}>{item.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-search">
          <input
            placeholder="Buscar"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <button>🔍</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <div className="hero-left">
          <div className="hero-mockup">
            <div className="mockup-dots">
              <span className="dot-r" /><span className="dot-y" /><span className="dot-g" />
            </div>
            <div className="mockup-logo">
              si<span>g</span>ep<span className="mockup-logo-ii">II</span>
            </div>
            <div className="mockup-sub">Sistema de Información y Gestión del Empleo Público</div>
            <div className="mockup-badge">1</div>
          </div>
        </div>

        <div className="hero-right">
          <button className="hero-arrow" onClick={prev}>‹</button>
          <div>
            <div className="alert-title">{SLIDES[slide].title}</div>
            <div className="alert-text">{SLIDES[slide].text}</div>
            <div className="dots-row">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`dot-ind${i === slide ? " on" : ""}`}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>
          </div>
          <button className="hero-arrow hero-right-arrow" onClick={next}>›</button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        SIGEP II &rsaquo; <span>SIGEP II</span>
      </div>

      {/* Main Content */}
      <div className="main-section">
        <h1 className="main-title">Bienvenido a SIGEP II</h1>

        <p className="main-text">
          El Departamento Administrativo de la Función Pública lidera desde el año 2010
          la implementación del Sistema de Información y Gestión del Empleo Público (SIGEP)
          con el fin de compilar información de gestión del talento humano al servicio del
          Estado Colombiano.
        </p>

        <button 
          className="cta-btn"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
        >
          Iniciar Sesion
        </button>

        <div className="cards-row">
          {CARDS.map((card) => (
            <div
              className="info-card"
              key={card.title}
              onClick={() => {
                if (card.title === "Hoja de Vida") {
                  navigate("/hoja-de-vida");
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="card-icon">{card.icon}</div>
              <div className="card-title">{card.title}</div>
              <div className="card-desc">{card.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>Departamento Administrativo de la Función Pública — República de Colombia</p>
        <p className="footer-meta">
          <a href="#">www.funcionpublica.gov.co</a> | PBX: 601 7395656
        </p>
      </div>

    </div>
  );
}