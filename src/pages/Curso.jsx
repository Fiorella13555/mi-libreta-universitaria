import { useParams, useNavigate, Link } from "react-router-dom";
import { useData } from "../utils/store.jsx";
import { promedioPonderado, estadoNota } from "../utils/grades.js";

export default function Curso() {
  const { cicloId, cursoId } = useParams();
  const { getCurso, updateCurso } = useData();
  const navigate = useNavigate();
  const { ciclo, curso } = getCurso(cicloId, cursoId);

  if (!ciclo || !curso) {
    return (
      <main className="main">
        <p className="muted">Ese curso no existe.</p>
      </main>
    );
  }

  const prom = promedioPonderado(curso.criterios);
  const estado = estadoNota(prom.promedio, curso.notaMinima, prom.pesoCalificado);

  const addArchivo = () => {
    const nombre = prompt("Nombre del archivo o material:");
    if (!nombre) return;
    const slug = nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const ruta = `ciclos/${ciclo.id}/${curso.id}/${slug}.md`;
    updateCurso(ciclo.id, curso.id, {
      archivos: [...curso.archivos, { nombre, ruta }],
    });
  };

  return (
    <main className="main">
      <div className="eyebrow">{ciclo.nombre}</div>
      <h1>{curso.nombre}</h1>
      <div style={{ display: "flex", gap: 10, margin: "18px 0 28px" }}>
        <button className="btn" onClick={() => navigate(`/calculadora/${ciclo.id}/${curso.id}`)}>
          🧮 Abrir calculadora de notas
        </button>
        <span className={`status ${estado.clase}`} style={{ alignSelf: "center" }}>
          {prom.pesoCalificado > 0
            ? `${prom.promedio.toFixed(2)} / ${curso.escala} · ${estado.texto}`
            : "Sin notas registradas"}
        </span>
      </div>

      <div className="card">
        <h2>Carpeta de archivos</h2>
        <p className="muted" style={{ marginTop: -8 }}>
          Esta es la ruta real dentro del repositorio. Sube ahí tus apuntes, sílabos
          o PDFs vía Git, y regístralos aquí para tenerlos indexados.
        </p>
        {curso.archivos.length === 0 ? (
          <p className="muted">Todavía no registras archivos para este curso.</p>
        ) : (
          <ul className="file-list">
            {curso.archivos.map((a, i) => (
              <li key={i}>
                <span style={{ flex: 1 }}>📄 {a.nombre}</span>
                <code>{a.ruta}</code>
              </li>
            ))}
          </ul>
        )}
        <button className="btn secondary" style={{ marginTop: 16 }} onClick={addArchivo}>
          + Registrar archivo
        </button>
      </div>
    </main>
  );
}
