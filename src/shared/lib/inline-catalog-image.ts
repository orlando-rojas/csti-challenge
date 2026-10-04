import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const cache = new Map<string, Promise<string | null>>();

export function inlineCatalogImage(
  src: string,
  width: number,
  quality = 45,
): Promise<string | null> {
  const key = `${src}@${width}@${quality}`;
  const existing = cache.get(key);
  if (existing) return existing;

  const pending = encode(src, width, quality);
  cache.set(key, pending);
  return pending;
}

async function encode(
  src: string,
  width: number,
  quality: number,
): Promise<string | null> {
  if (!src.startsWith("/catalog/") || src.includes("..")) return null;

  try {
    const file = path.join(process.cwd(), "public", src);
    const input = await readFile(file);
    const webp = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();
    return `data:image/webp;base64,${webp.toString("base64")}`;
  } catch {
    return null;
  }
}
