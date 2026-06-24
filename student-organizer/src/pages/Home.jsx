import { useNavigate } from "react-router-dom";
import { useData } from "../utils/store.jsx";
import { promedioPonderado, estadoNota } from "../utils/grades.js";

export default function Home() {
  const { data, exportJSON } = useData();
  const navigate = useNavigate();
  const totalCursos = data.ciclos.reduce((acc, c) => acc + c.cursos.length, 0);

  return (
    <main className="main">
      <div className="eyebrow">Resumen</div>
      <h1>Tu libreta, organizada por ciclo</h1>
      <p className="muted" style={{ maxWidth: 560 }}>
        Tienes {data.ciclos.length} ciclo(s) y {totalCursos} curso(s) guardados.
        Crea ciclos y cursos desde el panel de la izquierda; cada curso tiene su
        propia carpeta de archivos y su propia calculadora de notas.
      </p>

      {totalCursos === 0 ? (
        <div className="empty card" style={{ marginTop: 24 }}>
          <div className="big">Aún no tienes cursos</div>
          <p>Usa "+ nuevo ciclo" y luego "+ curso" en la barra lateral para empezar.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16, marginTop: 28 }}>
          {data.ciclos.map((ciclo) => (
            <div className="card" key={ciclo.id}>
              <h2>{ciclo.nombre}</h2>
              {ciclo.cursos.length === 0 ? (
                <p className="muted">Sin cursos todavía.</p>
              ) : (
                <ul className="file-list">
                  {ciclo.cursos.map((curso) => {
                    const prom = promedioPonderado(curso.criterios);
                    const estado = estadoNota(prom.promedio, curso.notaMinima, prom.pesoCalificado);
                    return (
                      <li
                        key={curso.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/curso/${ciclo.id}/${curso.id}`)}
                      >
                        <span style={{ flex: 1 }}>{curso.nombre}</span>
                        <code>
                          {prom.pesoCalificado > 0
                            ? `${prom.promedio.toFixed(2)} / ${curso.escala}`
                            : "sin notas"}
                        </code>
                        <span className={`status ${estado.clase}`} style={{ fontSize: "0.7rem" }}>
                          {estado.texto}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 32, display: "flex", gap: 10 }}>
        <button className="btn secondary" onClick={exportJSON}>
          ⤓ Exportar mi data (JSON)
        </button>
      </div>
    </main>
  );
}
