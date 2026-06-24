import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../utils/store.jsx";

export default function Sidebar() {
  const { data, addCiclo, addCurso, removeCiclo, removeCurso, exportJSON } = useData();
  const navigate = useNavigate();
  const params = useParams();
  const [openCiclos, setOpenCiclos] = useState(() => {
    const first = data.ciclos[0]?.id;
    return first ? { [first]: true } : {};
  });
  const [newCicloName, setNewCicloName] = useState("");
  const [newCursoName, setNewCursoName] = useState({});

  const toggle = (id) => setOpenCiclos((o) => ({ ...o, [id]: !o[id] }));

  const handleAddCiclo = (e) => {
    e.preventDefault();
    if (!newCicloName.trim()) return;
    addCiclo(newCicloName.trim());
    setNewCicloName("");
  };

  const handleAddCurso = (cicloId, e) => {
    e.preventDefault();
    const nombre = (newCursoName[cicloId] || "").trim();
    if (!nombre) return;
    addCurso(cicloId, nombre);
    setNewCursoName((s) => ({ ...s, [cicloId]: "" }));
  };

  return (
    <nav className="sidebar">
      <div className="brand">
        Mi <span>Libreta</span> Universitaria
      </div>

      {data.ciclos.map((ciclo) => (
        <div className="ciclo-tab" key={ciclo.id}>
          <div
            className={`ciclo-header ${openCiclos[ciclo.id] ? "open" : ""}`}
            onClick={() => toggle(ciclo.id)}
          >
            <span>📁 {ciclo.nombre}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                className="icon-btn"
                style={{ padding: "2px 6px", fontSize: "0.7rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`¿Borrar "${ciclo.nombre}" y todos sus cursos?`)) {
                    removeCiclo(ciclo.id);
                  }
                }}
                title="Eliminar ciclo"
              >
                ✕
              </button>
              <span className="chev">▶</span>
            </span>
          </div>

          {openCiclos[ciclo.id] && (
            <div className="curso-list">
              {ciclo.cursos.map((curso) => (
                <div
                  key={curso.id}
                  className={`curso-item ${
                    params.cicloId === ciclo.id && params.cursoId === curso.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate(`/curso/${ciclo.id}/${curso.id}`)}
                >
                  {curso.nombre}
                </div>
              ))}
              <form
                className="add-row"
                onSubmit={(e) => handleAddCurso(ciclo.id, e)}
              >
                <input
                  placeholder="+ curso"
                  value={newCursoName[ciclo.id] || ""}
                  onChange={(e) =>
                    setNewCursoName((s) => ({ ...s, [ciclo.id]: e.target.value }))
                  }
                />
                <button type="submit">Añadir</button>
              </form>
            </div>
          )}
        </div>
      ))}

      <form className="add-row" onSubmit={handleAddCiclo} style={{ marginTop: 8 }}>
        <input
          placeholder="+ nuevo ciclo"
          value={newCicloName}
          onChange={(e) => setNewCicloName(e.target.value)}
        />
        <button type="submit">Añadir</button>
      </form>

      <div className="sidebar-footer">
        <button onClick={() => navigate("/")}>Inicio</button>
      </div>
    </nav>
  );
}
