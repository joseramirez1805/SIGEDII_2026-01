import { useNavigate } from "react-router-dom";
import "../css/PreguntasFrecuentes.css";

const PREGUNTAS = [
  {
    pregunta: "¿Cómo actualizo mi hoja de vida?",
    respuesta:
      "Ingrese al módulo Hoja de Vida y diligencie cada sección requerida. Recuerde guardar los cambios antes de salir.",
  },
  {
    pregunta: "¿Cómo cambio mi contraseña?",
    respuesta:
      "Desde el panel principal seleccione la opción Cambiar Contraseña y complete el formulario.",
  },
  {
    pregunta: "¿Qué formatos son permitidos para soportes?",
    respuesta:
      "Actualmente el sistema permite cargar documentos en formato PDF.",
  },
];

export default function PreguntasFrecuentes() {
  const navigate = useNavigate();

  return (
    <main className="pf-page">
      <div className="pf-container">

        <div className="pf-header">
          <h1 className="pf-title">Preguntas Frecuentes</h1>

          <button
            className="pf-button"
            onClick={() => navigate("/panel-sigep")}
          >
            ← Volver al panel
          </button>
        </div>

        <div className="pf-card">
          <p className="pf-description">
            Consulta las respuestas a las preguntas más comunes sobre el uso del sistema SIGEP II.
          </p>

          <div className="pf-list">
            {PREGUNTAS.map((item, index) => (
              <div key={index} className="pf-item">
                <h3 className="pf-question">
                  {item.pregunta}
                </h3>

                <p className="pf-answer">
                  {item.respuesta}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}