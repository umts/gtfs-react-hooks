import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import neostandard from 'neostandard'

export default defineConfig([
  globalIgnores(['dist']),
  ...neostandard({ env: ['browser'] }),
  { extends: [reactHooks.configs['recommended-latest']] },
])
