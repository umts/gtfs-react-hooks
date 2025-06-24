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
      external: ['change-case', 'jszip', 'gtfs-realtime-bindings', 'papaparse', 'react'],
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
    coverage: {
      enabled: true,
      include: ['lib/**/*'],
      thresholds: {
        100: true,
      },
    },
  },
})
