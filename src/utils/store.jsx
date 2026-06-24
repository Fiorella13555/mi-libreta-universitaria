import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { seedData } from "../data/seedData.js";

const STORAGE_KEY = "libreta-universitaria-data";
const DataContext = createContext(null);

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("No se pudo leer localStorage, usando datos de ejemplo.", e);
  }
  return seedData;
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function DataProvider({ children }) {
  const [data, setData] = useState(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addCiclo = useCallback((nombre) => {
    setData((d) => ({
      ...d,
      ciclos: [...d.ciclos, { id: uid("ciclo"), nombre, cursos: [] }],
    }));
  }, []);

  const removeCiclo = useCallback((cicloId) => {
    setData((d) => ({ ...d, ciclos: d.ciclos.filter((c) => c.id !== cicloId) }));
  }, []);

  const addCurso = useCallback((cicloId, nombre) => {
    setData((d) => ({
      ...d,
      ciclos: d.ciclos.map((c) =>
        c.id === cicloId
          ? {
              ...c,
              cursos: [
                ...c.cursos,
                {
                  id: uid("curso"),
                  nombre,
                  notaMinima: 11,
                  escala: 20,
                  criterios: [],
                  archivos: [],
                },
              ],
            }
          : c
      ),
    }));
  }, []);

  const removeCurso = useCallback((cicloId, cursoId) => {
    setData((d) => ({
      ...d,
      ciclos: d.ciclos.map((c) =>
        c.id === cicloId
          ? { ...c, cursos: c.cursos.filter((cu) => cu.id !== cursoId) }
          : c
      ),
    }));
  }, []);

  const updateCurso = useCallback((cicloId, cursoId, patch) => {
    setData((d) => ({
      ...d,
      ciclos: d.ciclos.map((c) =>
        c.id === cicloId
          ? {
              ...c,
              cursos: c.cursos.map((cu) =>
                cu.id === cursoId ? { ...cu, ...patch } : cu
              ),
            }
          : c
      ),
    }));
  }, []);

  const importData = useCallback((newData) => {
    setData(newData);
  }, []);

  const resetData = useCallback(() => {
    setData(seedData);
  }, []);

  const getCurso = useCallback(
    (cicloId, cursoId) => {
      const ciclo = data.ciclos.find((c) => c.id === cicloId);
      const curso = ciclo?.cursos.find((cu) => cu.id === cursoId);
      return { ciclo, curso };
    },
    [data]
  );

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mis-cursos.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const value = {
    data,
    addCiclo,
    removeCiclo,
    addCurso,
    removeCurso,
    updateCurso,
    importData,
    resetData,
    getCurso,
    exportJSON,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData debe usarse dentro de <DataProvider>");
  return ctx;
}
