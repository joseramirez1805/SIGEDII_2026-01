import { Link } from "react-router-dom";

export default function AuthLayout({ children }) {
  return (
    <div className="sigep-root login-root">
      <header className="top-bar">
        <div className="gov-logo">GOV.CO</div>
        <div className="top-bar-right">
          <button type="button">Seleccionar idioma</button>
          <span>A+</span>
          <span>A-</span>
        </div>
      </header>

      <nav className="navbar">
        <div className="nav-brand">
          <Link className="brand-name" to="/home">
            Función Pública
          </Link>
        </div>

        <ul className="nav-links">
          <li><Link to="/home">SIGEP II</Link></li>
          <li><a href="#">¿Qué es?</a></li>
          <li><a href="#">Directorios</a></li>
          <li><a href="#">Cifras</a></li>
          <li><a href="#">Instructivos y Formatos</a></li>
          <li><a href="#">Preguntas Frecuentes</a></li>
          <li><Link className="active" to="/login">Ingresar</Link></li>
        </ul>
      </nav>

      {children}

      <footer className="footer">
        <div>
          Departamento Administrativo de la Función Pública — República de Colombia
        </div>
        <div className="footer-meta">
          <a href="#">www.funcionpublica.gov.co</a> | PBX: 601 7395656
        </div>
      </footer>
    </div>
  );
}