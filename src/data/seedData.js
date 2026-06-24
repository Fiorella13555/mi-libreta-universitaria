// Datos de ejemplo. Edita, agrega o borra ciclos/cursos desde la app
// (se guardan en tu navegador), o edita este archivo directamente
// y vuelve a desplegar si prefieres versionar tu data en el repo.
export const seedData = {
  ciclos: [
    {
      id: "ciclo-1",
      nombre: "Ciclo 1",
      cursos: [
        {
          id: "curso-ejemplo",
          nombre: "Curso de ejemplo",
          notaMinima: 11,
          escala: 20,
          criterios: [
            { id: "c1", nombre: "Prácticas", peso: 30, nota: null },
            { id: "c2", nombre: "Examen parcial", peso: 30, nota: null },
            { id: "c3", nombre: "Examen final", peso: 40, nota: null },
          ],
          archivos: [
            {
              nombre: "Notas de clase",
              ruta: "ciclos/ciclo-1/curso-ejemplo/notas.md",
            },
          ],
        },
      ],
    },
  ],
};
