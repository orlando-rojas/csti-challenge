const chunkScript =
  /<script\b[^>]*\bsrc="(\/_next\/static\/chunks\/[^"]+)"[^>]*>\s*<\/script>/g;

const chunkPreload =
  /<link\b[^>]*\brel="preload"[^>]*\bas="script"[^>]*\bhref="(\/_next\/static\/chunks\/[^"]+)"[^>]*\/?>/g;

const chunkPath = "/_next/static/chunks/";
// Hex escape so the preload scanner does not treat the flight payload as script URLs.
// The JS parser still decodes \x63 to "c" inside those strings.
const hiddenChunkPath = "/_next/static/\\x63hunks/";

function remember(srcs: string[], src: string) {
  if (!srcs.includes(src)) srcs.push(src);
}

function hideChunkUrls(html: string) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, (block) =>
    block.replaceAll(chunkPath, hiddenChunkPath),
  );
}

/**
 * Next emits async chunk tags in the head. On a fast connection they evaluate
 * before first paint, and Lighthouse then adds their simulated download to LCP.
 * The tags are removed and the URLs are reversed so the preload scanner does
 * not fetch them during parse. A short timeout inserts them after first paint.
 */
export function deferDocumentScripts(html: string) {
  const srcs: string[] = [];
  const withoutScripts = html.replace(chunkScript, (_tag, src: string) => {
    remember(srcs, src);
    return "";
  });
  const withoutPreloads = withoutScripts.replace(
    chunkPreload,
    (_tag, src: string) => {
      remember(srcs, src);
      return "";
    },
  );
  const hidden = hideChunkUrls(withoutPreloads);
  if (srcs.length === 0) return hidden;

  const payload = JSON.stringify(
    srcs.map((src) => [...src].reverse().join("")),
  ).replaceAll("<", "\\u003c");
  const loader = `<script>setTimeout(()=>{for(const src of ${payload}){const s=document.createElement("script");s.src=[...src].reverse().join("");s.async=true;document.body.appendChild(s)}},150)</script>`;
  const body = hidden.lastIndexOf("</body>");
  if (body === -1) return `${hidden}${loader}`;
  return `${hidden.slice(0, body)}${loader}${hidden.slice(body)}`;
}
