import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      name: 'GtfsReactHooks',
      entry: resolve(__dirname, 'lib/index.js'),
      fileName: 'gtfs-react-hooks',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['jszip', 'papaparse', 'react'],
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
  },
})
