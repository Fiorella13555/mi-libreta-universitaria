// criterios: [{ id, nombre, peso (0-100), nota: number|null }]

export function promedioPonderado(criterios = []) {
  let pesoCalificado = 0;
  let sumaPonderada = 0;
  let pesoTotal = 0;

  for (const c of criterios) {
    pesoTotal += Number(c.peso) || 0;
    if (c.nota !== null && c.nota !== "" && !Number.isNaN(Number(c.nota))) {
      pesoCalificado += Number(c.peso) || 0;
      sumaPonderada += (Number(c.nota) * (Number(c.peso) || 0)) / 100;
    }
  }

  // Promedio proyectado sobre el 100% del curso (asume 0 en lo no calificado)
  const promedio = sumaPonderada;

  return { promedio, pesoCalificado, pesoTotal, sumaPonderada };
}

export function estadoNota(promedio, notaMinima, pesoCalificado) {
  if (pesoCalificado === 0) {
    return { clase: "warn", texto: "Sin notas" };
  }
  if (promedio >= notaMinima) {
    return { clase: "ok", texto: "Aprobando" };
  }
  const margen = notaMinima - promedio;
  if (margen <= 1.5) {
    return { clase: "warn", texto: "En riesgo" };
  }
  return { clase: "danger", texto: "Desaprobando" };
}

// ¿Qué nota necesito en promedio en los criterios restantes (sin nota)
// para alcanzar la nota mínima, dado lo ya obtenido?
export function notaNecesaria(criterios = [], notaMinima, escala = 20) {
  const { sumaPonderada, pesoTotal } = promedioPonderado(criterios);
  const pesoRestante = criterios.reduce((acc, c) => {
    const sinNota = c.nota === null || c.nota === "" || Number.isNaN(Number(c.nota));
    return acc + (sinNota ? Number(c.peso) || 0 : 0);
  }, 0);

  if (pesoRestante === 0) {
    return { aplica: false, pesoRestante: 0 };
  }

  const faltante = notaMinima - sumaPonderada;
  const necesaria = (faltante / pesoRestante) * 100;

  return {
    aplica: true,
    pesoRestante,
    necesaria,
    imposible: necesaria > escala,
    yaAsegurado: necesaria <= 0,
  };
}
