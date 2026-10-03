import "server-only";

import { metrics, trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("csti-challenge");

type Histogram = ReturnType<
  ReturnType<typeof metrics.getMeter>["createHistogram"]
>;
type Counter = ReturnType<ReturnType<typeof metrics.getMeter>["createCounter"]>;

const histograms = new Map<string, Histogram>();
let fallbackCounter: Counter | undefined;

export function getTracer() {
  return tracer;
}

export function recordHistogram(
  name: string,
  value: number,
  attributes?: Record<string, string>,
) {
  const meter = metrics.getMeter("csti-challenge");
  let histogram = histograms.get(name);
  if (!histogram) {
    histogram = meter.createHistogram(name, { unit: "ms" });
    histograms.set(name, histogram);
  }
  histogram.record(value, attributes);
}

export function recordFallback(resource: string) {
  const meter = metrics.getMeter("csti-challenge");
  fallbackCounter ??= meter.createCounter("catalog.fallback.used");
  fallbackCounter.add(1, { resource });
}

export { SpanStatusCode };
