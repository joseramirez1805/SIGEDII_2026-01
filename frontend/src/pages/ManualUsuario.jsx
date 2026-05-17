import { useNavigate } from "react-router-dom";
import "../css/ManualUsuario.css";

const SECCIONES = [
  {
    titulo: "Ingreso al sistema",
    texto:
      "Accede utilizando tu tipo y número de documento junto con tu contraseña.",
  },
  {
    titulo: "Actualización de hoja de vida",
    texto:
      "Diligencia cada módulo y guarda la información correspondiente.",
  },
  {
    titulo: "Carga de documentos",
    texto:
      "Adjunta soportes académicos y laborales en formato PDF.",
  },
  {
    titulo: "Consulta de certificados",
    texto:
      "Genera certificados de situación actual dentro del sistema.",
  },
  {
    titulo: "Cambio de contraseña",
    texto:
      "Actualiza tus credenciales desde el panel principal.",
  },
];

export default function ManualUsuario() {
  const navigate = useNavigate();

  return (
    <main className="mu-page">
      <div className="mu-container">

        <div className="mu-header">
          <h1 className="mu-title">Manual de Usuario</h1>

          <button
            className="mu-button-back"
            onClick={() => navigate("/panel-sigep")}
          >
            ← Volver al panel
          </button>
        </div>

        <div className="mu-card">
          <p className="mu-description">
            Bienvenido al manual básico del sistema SIGEP II. Aquí encontrarás
            información general sobre las funcionalidades disponibles.
          </p>

          <div className="mu-grid">
            {SECCIONES.map((item, index) => (
              <div key={index} className="mu-item">

                <div className="mu-item-number">
                  {index + 1}
                </div>

                <h3 className="mu-item-title">
                  {item.titulo}
                </h3>

                <p className="mu-item-text">
                  {item.texto}
                </p>

              </div>
            ))}
          </div>

          <button className="mu-download">
            Descargar Manual PDF
          </button>
        </div>

      </div>
    </main>
  );
}