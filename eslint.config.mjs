import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "storybook-static/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
    "public/**",
  ]),
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        { type: "shared", pattern: "src/shared/**" },
        { type: "catalog-domain", pattern: "src/modules/catalog/domain/**" },
        {
          type: "catalog-application",
          pattern: "src/modules/catalog/application/**",
        },
        {
          type: "catalog-infrastructure",
          pattern: "src/modules/catalog/infrastructure/**",
        },
        { type: "catalog-ui", pattern: "src/modules/catalog/ui/**" },
        { type: "cart-domain", pattern: "src/modules/cart/domain/**" },
        { type: "cart-store", pattern: "src/modules/cart/store/**" },
        { type: "cart-ui", pattern: "src/modules/cart/ui/**" },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["**/*.test.ts", "**/*.test.tsx", "**/*.stories.tsx"],
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          policies: [
            {
              from: { element: { type: "catalog-domain" } },
              disallow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        "app",
                        "shared",
                        "catalog-application",
                        "catalog-infrastructure",
                        "catalog-ui",
                        "catalog-public",
                        "cart-domain",
                        "cart-store",
                        "cart-ui",
                        "cart-public",
                        "instrumentation",
                      ],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: "catalog-application" } },
              disallow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        "app",
                        "catalog-infrastructure",
                        "catalog-ui",
                        "catalog-public",
                        "cart-domain",
                        "cart-store",
                        "cart-ui",
                        "cart-public",
                        "instrumentation",
                      ],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: "catalog-ui" } },
              disallow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        "app",
                        "catalog-infrastructure",
                        "cart-domain",
                        "cart-store",
                        "cart-ui",
                        "instrumentation",
                      ],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: "catalog-infrastructure" } },
              disallow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        "app",
                        "catalog-ui",
                        "catalog-public",
                        "cart-domain",
                        "cart-store",
                        "cart-ui",
                        "cart-public",
                        "instrumentation",
                      ],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: "cart-domain" } },
              disallow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        "app",
                        "shared",
                        "catalog-domain",
                        "catalog-application",
                        "catalog-infrastructure",
                        "catalog-ui",
                        "catalog-public",
                        "cart-store",
                        "cart-ui",
                        "cart-public",
                        "instrumentation",
                      ],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: "cart-store" } },
              disallow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        "app",
                        "catalog-domain",
                        "catalog-application",
                        "catalog-infrastructure",
                        "catalog-ui",
                        "catalog-public",
                        "cart-ui",
                        "cart-public",
                        "instrumentation",
                      ],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: "cart-ui" } },
              disallow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        "app",
                        "catalog-domain",
                        "catalog-application",
                        "catalog-infrastructure",
                        "catalog-ui",
                        "catalog-public",
                        "instrumentation",
                      ],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: "app" } },
              disallow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        "catalog-domain",
                        "catalog-application",
                        "catalog-infrastructure",
                        "catalog-ui",
                        "cart-domain",
                        "cart-store",
                        "cart-ui",
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
