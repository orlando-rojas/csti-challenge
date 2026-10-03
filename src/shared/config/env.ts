import "server-only";

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    FAKESTORE_API_URL: z.url().default("https://fakestoreapi.com"),
    REVALIDATE_SECRET: z.string().min(8).optional(),
    SITE_INDEXABLE: z.enum(["true", "false"]).default("true"),
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
      .default("info"),
    OTEL_EXPORTER_OTLP_ENDPOINT: z.url().optional(),
    OTEL_EXPORTER_OTLP_HEADERS: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z
      .url()
      .default("https://csti-challenge.orlando-rojas.com"),
  },
  runtimeEnv: {
    FAKESTORE_API_URL: process.env.FAKESTORE_API_URL,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
    SITE_INDEXABLE: process.env.SITE_INDEXABLE,
    LOG_LEVEL: process.env.LOG_LEVEL,
    OTEL_EXPORTER_OTLP_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    OTEL_EXPORTER_OTLP_HEADERS: process.env.OTEL_EXPORTER_OTLP_HEADERS,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
