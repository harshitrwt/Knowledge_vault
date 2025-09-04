import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/generated/**",         // your generated code
      "prisma/**",                // prisma schema/migrations
      "**/migrations/**",         // prisma migrations folder
      "node_modules/@prisma/**",  // prisma client package
    ],
    rules: {
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;
