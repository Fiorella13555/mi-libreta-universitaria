import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../utils/store.jsx";
import { promedioPonderado, estadoNota, notaNecesaria } from "../utils/grades.js";

const COLORS = ["#F2B134", "#4ECDC4", "#E8546B", "#7C9CDC", "#C792EA", "#9CCC65"];

function uid() {
  return `crit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function Calculadora() {
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

  const criterios = curso.criterios;
  const { promedio, pesoCalificado, pesoTotal } = promedioPonderado(criterios);
  const estado = estadoNota(promedio, curso.notaMinima, pesoCalificado);
  const necesaria = notaNecesaria(criterios, curso.notaMinima, curso.escala);

  const patch = (next) => updateCurso(ciclo.id, curso.id, { criterios: next });

  const addCriterio = () => {
    patch([...criterios, { id: uid(), nombre: "Nuevo criterio", peso: 0, nota: null }]);
  };

  const updateCriterio = (id, field, value) => {
    patch(
      criterios.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const removeCriterio = (id) => {
    patch(criterios.filter((c) => c.id !== id));
  };

  return (
    <main className="main">
      <div className="eyebrow">{ciclo.nombre} · {curso.nombre}</div>
      <h1>Calculadora de notas</h1>
      <p className="muted" style={{ maxWidth: 600 }}>
        Define los criterios de evaluación tal como los pesa tu profesor (deben
        sumar 100%). Llena las notas que ya tengas; el resto se proyecta.
      </p>

      <div className="gauge" style={{ marginTop: 20 }}>
        <div className="num">
          {pesoCalificado > 0 ? promedio.toFixed(2) : "—"}
          <small> / {curso.escala}</small>
        </div>
        <div className="weightbar">
          {criterios.map((c, i) =>
            c.peso > 0 ? (
              <div
                key={c.id}
                className="seg"
                style={{
                  width: `${c.peso}%`,
                  background: COLORS[i % COLORS.length],
                  opacity: c.nota !== null && c.nota !== "" ? 1 : 0.25,
                }}
                title={`${c.nombre}: ${c.peso}%`}
              />
            ) : null
          )}
        </div>
        <span className={`status ${estado.clase}`}>{estado.texto}</span>
      </div>

      {pesoTotal !== 100 && (
        <p style={{ color: "var(--warn)", fontSize: "0.85rem", marginTop: -10 }}>
          ⚠ Los pesos suman {pesoTotal}%, no 100%. Ajusta para que el cálculo sea exacto.
        </p>
      )}

      <div className="card" style={{ marginTop: 16 }}>
        <div className="criterio-row" style={{ borderBottom: "1px solid var(--line)", fontSize: "0.78rem", color: "var(--ink-muted)" }}>
          <span>Criterio</span>
          <span>Peso %</span>
          <span>Nota (0–{curso.escala})</span>
          <span></span>
        </div>
        {criterios.map((c, i) => (
          <div className="criterio-row" key={c.id}>
            <input
              type="text"
              value={c.nombre}
              onChange={(e) => updateCriterio(c.id, "nombre", e.target.value)}
            />
            <input
              type="number"
              min="0"
              max="100"
              value={c.peso}
              onChange={(e) => updateCriterio(c.id, "peso", Number(e.target.value))}
            />
            <input
              type="number"
              min="0"
              max={curso.escala}
              step="0.1"
              placeholder="—"
              value={c.nota ?? ""}
              onChange={(e) =>
                updateCriterio(
                  c.id,
                  "nota",
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
            <button className="icon-btn" onClick={() => removeCriterio(c.id)} title="Eliminar">
              ✕
            </button>
          </div>
        ))}
        <button className="btn secondary" style={{ marginTop: 16 }} onClick={addCriterio}>
          + Agregar criterio
        </button>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: "1rem" }}>Nota mínima para aprobar</h2>
        <input
          type="number"
          min="0"
          max={curso.escala}
          step="0.5"
          value={curso.notaMinima}
          onChange={(e) => updateCurso(ciclo.id, curso.id, { notaMinima: Number(e.target.value) })}
          style={{
            background: "var(--bg)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
            borderRadius: 6,
            padding: "8px 10px",
            fontFamily: "var(--font-mono)",
            width: 90,
          }}
        />

        {necesaria.aplica ? (
          <div className="needed-box">
            {necesaria.yaAsegurado ? (
              <>✅ Ya asegurado: con lo que llevas, tienes la nota mínima cubierta aunque saques 0 en lo que falta.</>
            ) : necesaria.imposible ? (
              <>🚫 Con el peso restante ({necesaria.pesoRestante}%) ya no es posible llegar a {curso.notaMinima}, necesitarías más de {curso.escala}.</>
            ) : (
              <>
                Necesitas un promedio de <b>{necesaria.necesaria.toFixed(2)}</b> en el{" "}
                <b>{necesaria.pesoRestante}%</b> restante para llegar a {curso.notaMinima}.
              </>
            )}
          </div>
        ) : (
          <p className="muted" style={{ marginTop: 12 }}>
            Ya registraste notas en todos los criterios.
          </p>
        )}
      </div>

      <button className="btn secondary" style={{ marginTop: 20 }} onClick={() => navigate(`/curso/${ciclo.id}/${curso.id}`)}>
        ← Volver al curso
      </button>
    </main>
  );
}
