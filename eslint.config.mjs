import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import security from "eslint-plugin-security";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ── Security rules ──────────────────────────────────────────────────────────
  // eslint-plugin-security: catches common Node.js/JS security anti-patterns.
  // Applied only to server-side and shared code; harmless on client components.
  {
    plugins: {
      security,
    },
    rules: {
      // Warn: bracket notation with dynamic keys can allow prototype pollution
      "security/detect-object-injection": "warn",
      // Warn: RegExp built from variable input can be used for ReDoS attacks
      "security/detect-non-literal-regexp": "warn",
      // Warn: RegExp pattern with catastrophic backtracking potential
      "security/detect-unsafe-regex": "warn",
      // Error: eval() with a dynamic expression is a critical injection vector
      "security/detect-eval-with-expression": "error",
      // Warn: child_process.exec with user input allows command injection
      "security/detect-child-process": "warn",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "apply-migrations.js",
    "run-migration.js",
    "verify-db.js",
  ]),
]);

export default eslintConfig;
