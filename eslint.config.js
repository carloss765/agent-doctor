import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", "landing/.astro/**", "landing/dist/**"]
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {}
    },
    plugins: {
      "@typescript-eslint": typescriptEslint
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules
    }
  }
];
