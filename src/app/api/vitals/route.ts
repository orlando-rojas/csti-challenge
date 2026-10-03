import { logger } from "@/shared/lib/logger";
import { recordHistogram } from "@/shared/lib/telemetry";

const allowed = new Set(["LCP", "INP", "CLS", "TTFB", "FCP"]);

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ ok: false }, { status: 400 });
  }

  const metric = body as { name?: unknown; value?: unknown; rating?: unknown };
  if (typeof metric.name !== "string" || !allowed.has(metric.name)) {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (typeof metric.value !== "number" || !Number.isFinite(metric.value)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  recordHistogram(`web_vitals.${metric.name.toLowerCase()}`, metric.value, {
    rating: typeof metric.rating === "string" ? metric.rating : "unknown",
  });
  logger.info({ vital: metric.name, value: metric.value }, "web-vital");

  return new Response(null, { status: 204 });
}
