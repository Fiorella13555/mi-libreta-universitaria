# 📒 Mi Libreta Universitaria

App personal para organizar tus ciclos/cursos en carpetas y calcular tus
notas con los criterios de evaluación reales de cada curso.

## ¿Qué incluye?

- **Barra lateral tipo carpetas colgantes**: ciclo → curso.
- **Carpeta de archivos por curso**: `public/ciclos/<ciclo>/<curso>/` para
  guardar apuntes, PDFs o markdown reales dentro del repositorio.
- **Calculadora de notas por curso**: tú defines los criterios y pesos
  (cada profesor califica distinto), ves tu promedio en vivo y cuánto
  necesitas en lo que falta para aprobar.
- Tus ciclos/cursos/notas se guardan automáticamente en tu navegador
  (localStorage). Puedes exportarlos a JSON desde el botón de inicio
  para tener un respaldo versionable.

## Cómo correrlo en tu máquina

```bash
npm install
npm run dev
```

Abre el enlace que te muestre la terminal (usualmente http://localhost:5173).

## Cómo subirlo a GitHub y publicarlo (GitHub Pages)

1. Crea un repositorio nuevo en GitHub, por ejemplo `mi-libreta-universitaria`.
2. Edita `vite.config.js` y pon el nombre EXACTO de tu repo en `base`:
   ```js
   base: '/mi-libreta-universitaria/',
   ```
3. Sube el proyecto:
   ```bash
   git init
   git add .
   git commit -m "Primera versión de mi libreta universitaria"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/mi-libreta-universitaria.git
   git push -u origin main
   ```
4. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
   El workflow en `.github/workflows/deploy.yml` se encarga de compilar y
   publicar automáticamente cada vez que hagas push a `main`.
5. En unos minutos tu app estará en:
   `https://TU-USUARIO.github.io/mi-libreta-universitaria/`

## Cómo agregar tus carpetas reales de archivos

Crea las carpetas dentro de `public/ciclos/`, por ejemplo:

```
public/ciclos/ciclo-3/calculo-2/apuntes-clase1.pdf
public/ciclos/ciclo-3/calculo-2/resumen.md
```

Luego, dentro de la app, abre ese curso y usa "Registrar archivo" para que
aparezca listado (esto solo guarda la referencia/ruta; el archivo físico
lo subes tú vía Git).

## Notas

- El cálculo de notas usa una escala configurable por curso (por defecto 0–20).
- Los pesos de los criterios deben sumar 100% para que el cálculo sea exacto;
  la app te avisa si no es así.
