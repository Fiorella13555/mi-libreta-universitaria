import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️ IMPORTANTE: cambia 'mi-libreta-universitaria' por el nombre EXACTO
// de tu repositorio en GitHub (lo que aparece después de github.com/tu-usuario/)
export default defineConfig({
  plugins: [react()],
  base: '/mi-libreta-universitaria/',
})
