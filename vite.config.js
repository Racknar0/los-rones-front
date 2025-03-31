import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/administracion',
  build: {
    outDir: 'administracion', // Cambiar el directorio de salida
  },
})