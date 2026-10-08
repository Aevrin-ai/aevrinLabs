import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    plugins: { react },
    settings: { react: { version: "detect" } },
    rules: {
      // No ignore pattern: an unused capitalised import is as dead as any other.
      "@typescript-eslint/no-unused-vars": "error",
      // A component used in JSX but never imported is a crash at render.
      "react/jsx-no-undef": "error",
      "react/jsx-uses-vars": "error",
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
    rules: { "no-unused-vars": "error" },
  },
]);
