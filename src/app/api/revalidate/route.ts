import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";

import { env } from "@/shared/config/env";
import { logger } from "@/shared/lib/logger";

const tagPattern = /^(?:products|product:\d+)$/;

function secretsMatch(provided: string, expected: string): boolean {
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  const expected = env.REVALIDATE_SECRET;
  const provided = request.headers.get("x-revalidate-secret") ?? "";
  if (!expected || !secretsMatch(provided, expected)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => ({}));
  const tag =
    body &&
    typeof body === "object" &&
    "tag" in body &&
    typeof body.tag === "string"
      ? body.tag
      : "products";

  if (!tagPattern.test(tag)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  revalidateTag(tag, "max");
  logger.info({ tag }, "catalog revalidated");
  return Response.json({ ok: true, tag });
}
