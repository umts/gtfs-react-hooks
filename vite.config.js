import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.js'),
      name: 'GtfsReactHooks',
      fileName: 'gtfs-react-hooks',
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
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
    }
  },
})
