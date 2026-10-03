# ADR 0008: Observabilidad

## Contexto

La tienda corre fuera de Vercel. Hace falta ver latencia de FakeStore, el uso del fallback y las web vitals reales.

## Decisión

`src/instrumentation.ts` registra `@vercel/otel` (también sirve self-hosted) con el exportador OTLP. Las variables son `OTEL_EXPORTER_OTLP_ENDPOINT` y `OTEL_EXPORTER_OTLP_HEADERS`. Si no están, el proceso arranca igual y las métricas no salen del proceso.

Cada GET del catálogo abre un span `catalog.http.get` con status y reintentos. El fallback suma `catalog.fallback.used`. pino escribe JSON por stdout para Dokploy. `useReportWebVitals` manda LCP, INP, CLS, TTFB y FCP a `POST /api/vitals` con `sendBeacon`, y esa ruta los graba como histograma.

El dashboard versionado está en `ops/grafana/dashboard.json`.

## Consecuencias

Sin Grafana Cloud no hay tablero en vivo. Los logs de pino siguen estando en el contenedor. Sentry queda fuera de alcance.
