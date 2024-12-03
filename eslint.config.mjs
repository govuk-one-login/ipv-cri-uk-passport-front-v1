import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: [
      "src/app.test.js",
      "src/app-setup.test.js",
      "**/dist",
      "**/*.cjs"
    ]
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.mocha,
        ...globals.browser,
        sinon: true,
        expect: true,
        setupDefaultMocks: true
      }
    }
  },
  ...compat.extends("eslint:recommended", "prettier"),
  {
    rules: {
      "global-require": 0,
      "no-console": 2,
      "comma-dangle": 0,

      "padding-line-between-statements": [
        "error",
        {
          blankLine: "any",
          prev: "*",
          next: "*"
        }
      ]
    }
  },
  {
    files: ["test/browser/**/*"],
    rules: {
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          varsIgnorePattern: "Given|And|When|Then"
        }
      ]
    }
  }
];
