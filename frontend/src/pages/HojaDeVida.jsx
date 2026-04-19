import { useState } from "react";
import "../css/HojaDeVida.css";

const secciones = [
  { id: "datos-personales", titulo: "Datos personales" },
  { id: "direccion", titulo: "Dirección" },
  { id: "educacion", titulo: "Educación" },
  { id: "experiencia", titulo: "Experiencia laboral" },
  { id: "gerencia", titulo: "Gerencia pública" },
];

export default function HojaDeVida({ setPagina }) {
  const [seccionActual, setSeccionActual] = useState("datos-personales");

  const renderizarSeccion = () => {
    switch (seccionActual) {
      case "datos-personales":
        return <DatosPersonales />;
      case "direccion":
        return <Direccion />;
      case "educacion":
        return <Educacion />;
      case "experiencia":
        return <Experiencia />;
      case "gerencia":
        return (
          <div className="hv-bloque">
            <h2>Gerencia pública</h2>
            <p>Esta sección será implementada en futuras versiones del sistema.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="hv-root">
      <aside className="hv-sidebar">
        <h1 className="hv-titulo">Hoja de vida</h1>
        <p className="hv-subtitulo">SIGEP II</p>

        <nav className="hv-menu">
          {secciones.map((seccion) => (
            <button
              key={seccion.id}
              className={`hv-boton-menu ${
                seccionActual === seccion.id ? "activo" : ""
              }`}
              onClick={() => setSeccionActual(seccion.id)}
            >
              {seccion.titulo}
            </button>
          ))}
        </nav>
      </aside>

      <main className="hv-contenido">
        <header className="hv-cabecera">

          <div className="hv-header-top">
            <button
              className="hv-boton-volver"
              onClick={() => setPagina("home")}
            >
              ← Volver al inicio
            </button>
          </div>

          <h2>
            Sección:{" "}
            {secciones.find((s) => s.id === seccionActual)?.titulo}
          </h2>
          <p>Diligencia cada apartado de forma independiente.</p>
        </header>

        {renderizarSeccion()}
      </main>
    </div>
  );
}

/* =========================
   DATOS PERSONALES
========================= */

function DatosPersonales() {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaNacimiento: "",
    genero: "",
    correo: "",
    telefono: "",
  });

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    if (
      !form.nombres ||
      !form.apellidos ||
      !form.tipoDocumento ||
      !form.numeroDocumento ||
      !form.fechaNacimiento ||
      !form.genero ||
      !form.correo
    ) return "Campos obligatorios incompletos.";

    if (!form.correo.includes("@")) return "Correo inválido.";

    return "";
  };

  const guardar = () => {
    const err = validar();
    if (err) {
      setError(err);
      setMensaje("");
      return;
    }

    setError("");
    setMensaje("Datos guardados correctamente.");
    console.log(form);
  };

  return (
    <div className="hv-bloque">
      <h2>Datos personales</h2>

      {error && <div className="login-error">{error}</div>}
      {mensaje && <div className="login-success">{mensaje}</div>}

      <div className="hv-form-grid">
        <input name="nombres" placeholder="Nombres" value={form.nombres} onChange={manejarCambio}/>
        <input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={manejarCambio}/>
        <select name="tipoDocumento" value={form.tipoDocumento} onChange={manejarCambio}>
          <option value="">Tipo documento</option>
          <option>CC</option>
          <option>CE</option>
        </select>
        <input name="numeroDocumento" placeholder="Número documento" value={form.numeroDocumento} onChange={manejarCambio}/>
        <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={manejarCambio}/>
        <select name="genero" value={form.genero} onChange={manejarCambio}>
          <option value="">Género</option>
          <option>Masculino</option>
          <option>Femenino</option>
        </select>
        <input name="correo" placeholder="Correo" value={form.correo} onChange={manejarCambio}/>
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={manejarCambio}/>
      </div>

      <div className="hv-acciones-formulario">
        <button className="hv-boton-principal" onClick={guardar}>
          Guardar datos
        </button>
      </div>
    </div>
  );
}

/* =========================
   DIRECCIÓN
========================= */

function Direccion() {
  const [tipoZona, setTipoZona] = useState("");
  const [form, setForm] = useState({
    departamento: "",
    municipio: "",
    direccion: "",
    vereda: "",
  });

  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = () => {
    if (!tipoZona || !form.departamento || !form.municipio) {
      setError("Campos obligatorios.");
      return;
    }

    setError("");
    console.log({ tipoZona, ...form });
  };

  return (
    <div className="hv-bloque">
      <h2>Dirección</h2>

      {error && <div className="login-error">{error}</div>}

      <div className="hv-form-grid">
        <select onChange={(e) => setTipoZona(e.target.value)}>
          <option value="">Zona</option>
          <option value="urbana">Urbana</option>
          <option value="rural">Rural</option>
        </select>

        <input name="departamento" placeholder="Departamento" onChange={manejarCambio}/>
        <input name="municipio" placeholder="Municipio" onChange={manejarCambio}/>

        {tipoZona === "urbana" && (
          <input name="direccion" placeholder="Dirección" onChange={manejarCambio}/>
        )}

        {tipoZona === "rural" && (
          <input name="vereda" placeholder="Vereda" onChange={manejarCambio}/>
        )}
      </div>

      <div className="hv-acciones-formulario">
        <button className="hv-boton-principal" onClick={guardar}>
          Guardar dirección
        </button>
      </div>
    </div>
  );
}

/* =========================
   EDUCACIÓN
========================= */

function Educacion() {
  const [form, setForm] = useState({
    nivel: "",
    institucion: "",
    titulo: "",
    anio: "",
  });

  const [lista, setLista] = useState([]);
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const agregar = () => {
    if (!form.nivel || !form.institucion || !form.titulo || !form.anio) {
      setError("Campos obligatorios.");
      return;
    }

    setLista([...lista, form]);
    setForm({ nivel: "", institucion: "", titulo: "", anio: "" });
    setError("");
  };

  return (
    <div className="hv-bloque">
      <h2>Educación</h2>

      {error && <div className="login-error">{error}</div>}

      <div className="hv-form-grid">
        <input name="nivel" placeholder="Nivel" value={form.nivel} onChange={manejarCambio}/>
        <input name="institucion" placeholder="Institución" value={form.institucion} onChange={manejarCambio}/>
        <input name="titulo" placeholder="Título" value={form.titulo} onChange={manejarCambio}/>
        <input name="anio" placeholder="Año" value={form.anio} onChange={manejarCambio}/>
      </div>

      <div className="hv-acciones-formulario">
        <button className="hv-boton-principal" onClick={agregar}>
          Agregar estudio
        </button>
      </div>

      {lista.map((item, i) => (
        <div key={i} className="hv-item">
          <strong>{item.nivel}</strong> - {item.titulo} <br />
          {item.institucion} ({item.anio})
        </div>
      ))}
    </div>
  );
}

/* =========================
   EXPERIENCIA
========================= */

function Experiencia() {
  const [form, setForm] = useState({
    empresa: "",
    cargo: "",
    fechaInicio: "",
    fechaFin: "",
    actual: false,
  });

  const [lista, setLista] = useState([]);
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validar = () => {
    if (!form.empresa || !form.cargo || !form.fechaInicio)
      return "Campos obligatorios.";

    if (!form.actual && !form.fechaFin)
      return "Ingrese fecha fin o marque actual.";

    if (form.fechaFin && form.fechaFin < form.fechaInicio)
      return "Fechas inválidas.";

    return "";
  };

  const agregar = () => {
    const err = validar();

    if (err) {
      setError(err);
      return;
    }

    setLista([...lista, form]);

    setForm({
      empresa: "",
      cargo: "",
      fechaInicio: "",
      fechaFin: "",
      actual: false,
    });

    setError("");
  };

  return (
    <div className="hv-bloque">
      <h2>Experiencia laboral</h2>

      {error && <div className="login-error">{error}</div>}

      <div className="hv-form-grid">
        <input name="empresa" placeholder="Empresa" value={form.empresa} onChange={manejarCambio}/>
        <input name="cargo" placeholder="Cargo" value={form.cargo} onChange={manejarCambio}/>
        <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={manejarCambio}/>

        {!form.actual && (
          <input type="date" name="fechaFin" value={form.fechaFin} onChange={manejarCambio}/>
        )}
      </div>

      <div className="hv-checkbox">
        <input
          type="checkbox"
          name="actual"
          checked={form.actual}
          onChange={manejarCambio}
          id="trabajoActual"
        />
        <label htmlFor="trabajoActual">Trabajo actual</label>
      </div>

      <div className="hv-acciones-formulario">
        <button className="hv-boton-principal" onClick={agregar}>
          Agregar experiencia
        </button>
      </div>

      {lista.map((item, i) => (
        <div key={i} className="hv-item">
          <strong>{item.cargo}</strong> - {item.empresa} <br />
          {item.fechaInicio} → {item.actual ? "Actualidad" : item.fechaFin}
        </div>
      ))}
    </div>
  );
}