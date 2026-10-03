export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { registerOTel } = await import("@vercel/otel");
  registerOTel({ serviceName: "csti-challenge" });

  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return;

  const { metrics } = await import("@opentelemetry/api");
  const { MeterProvider, PeriodicExportingMetricReader } =
    await import("@opentelemetry/sdk-metrics");
  const { OTLPMetricExporter } =
    await import("@opentelemetry/exporter-metrics-otlp-http");

  const provider = new MeterProvider({
    readers: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(),
        exportIntervalMillis: 15_000,
      }),
    ],
  });

  try {
    metrics.setGlobalMeterProvider(provider);
  } catch {
    // A provider may already be registered by the trace SDK.
  }
}
