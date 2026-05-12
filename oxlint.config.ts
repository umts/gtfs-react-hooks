import { defineConfig } from "oxlint"

export default defineConfig(
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": [
    "eslint",
    "unicorn",
    "react",
    "react-perf",
    "oxc",
    "import",
    "promise",
    "vitest"
  ],
  "categories": {
    "correctness": "error",
    "suspicious": "error",
    "pedantic": "warn",
    "perf": "error",
    "restriction": "error"
  }
}
);
