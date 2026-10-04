import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

export function inlineCatalogImage(
  src: string,
  width: number,
  quality = 45,
): Promise<string | null> {
  return encode(src, width, quality);
}

// "use cache" dedupes by arguments. A module Map of in-flight promises
// deadlocks that fill when two renders share it.
async function encode(
  src: string,
  width: number,
  quality: number,
): Promise<string | null> {
  "use cache";
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
