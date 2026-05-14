import { defineConfig } from "oxlint";

export default defineConfig({
  $schema: "./node_modules/oxlint/configuration_schema.json",
  plugins: ["unicorn", "react", "react-perf", "oxc", "import", "promise", "vitest"],
  categories: {
    correctness: "error",
    suspicious: "warn",
    pedantic: "warn",
    perf: "error",
    restriction: "error",
  },
  rules: {
    "no-undefined": "off",
    "import/no-default-export": "off",
    "import/no-relative-parent-imports": "off",
    "oxc/no-async-await": "off",
    "oxc/no-rest-spread-properties": "off",
  },
  overrides: [
    {
      files: ["*.test.js"],
      rules: {
        "max-lines-per-function": "off",
        "vitest/require-test-timeout": "off",
      },
    },
  ],
});
