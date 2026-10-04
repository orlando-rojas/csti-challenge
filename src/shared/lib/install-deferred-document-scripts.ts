import { ServerResponse } from "node:http";
import { gzipSync } from "node:zlib";

import { deferDocumentScripts } from "@/shared/lib/defer-document-scripts";

const installed = Symbol.for("csti.deferDocumentScripts.installed");
const buffer = Symbol.for("csti.deferDocumentScripts.buffer");

type BufferedResponse = ServerResponse & {
  [buffer]?: Buffer[];
};

function headerValue(headers: unknown, name: string) {
  if (!headers || typeof headers !== "object") return undefined;
  if (Array.isArray(headers)) {
    for (let index = 0; index < headers.length; index += 2) {
      if (String(headers[index]).toLowerCase() === name) {
        return headers[index + 1];
      }
    }
    return undefined;
  }
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === name) return value;
  }
  return undefined;
}

function withoutContentLength(headers: unknown) {
  if (!headers || typeof headers !== "object") return headers;
  if (Array.isArray(headers)) {
    const next: unknown[] = [];
    for (let index = 0; index < headers.length; index += 2) {
      if (String(headers[index]).toLowerCase() === "content-length") continue;
      next.push(headers[index], headers[index + 1]);
    }
    return next;
  }
  const next: Record<string, unknown> = {
    ...(headers as Record<string, unknown>),
  };
  for (const key of Object.keys(next)) {
    if (key.toLowerCase() === "content-length") delete next[key];
  }
  return next;
}

function isHtmlResponse(response: ServerResponse, headers?: unknown) {
  const type = String(
    headerValue(headers, "content-type") ??
      response.getHeader("content-type") ??
      "",
  );
  return type.includes("text/html");
}

function acceptsGzip(response: ServerResponse) {
  const header = response.req?.headers["accept-encoding"];
  const accept = Array.isArray(header)
    ? header.join(",")
    : String(header ?? "");
  return /\bgzip\b/.test(accept);
}

function asBuffer(
  chunk: string | Uint8Array,
  encoding: BufferEncoding | undefined,
) {
  if (typeof chunk === "string") return Buffer.from(chunk, encoding ?? "utf8");
  return Buffer.from(chunk);
}

/**
 * Buffers HTML documents and moves Next's chunk tags to after first paint.
 * Installed once, from the Node.js server instrumentation hook.
 */
export function installDeferredDocumentScripts() {
  const proto = ServerResponse.prototype as ServerResponse & {
    [installed]?: boolean;
  };
  if (proto[installed]) return;
  proto[installed] = true;

  const htmlResponses = new WeakSet<ServerResponse>();
  const gzipResponses = new WeakSet<ServerResponse>();
  const originalWriteHead = ServerResponse.prototype.writeHead;
  const originalWrite = ServerResponse.prototype.write;
  const originalEnd = ServerResponse.prototype.end;

  ServerResponse.prototype.writeHead = function writeHead(
    this: ServerResponse,
    ...args: unknown[]
  ) {
    const headers = args.length >= 3 ? args[2] : args[1];
    if (isHtmlResponse(this, headers)) {
      htmlResponses.add(this);
      this.removeHeader("content-length");
      if (acceptsGzip(this)) {
        gzipResponses.add(this);
        this.setHeader("content-encoding", "gzip");
        this.setHeader("vary", "accept-encoding");
      }
      const stripped = withoutContentLength(headers);
      if (args.length >= 3) args[2] = stripped;
      else if (headers && typeof headers === "object") args[1] = stripped;
    }
    return originalWriteHead.apply(
      this,
      args as Parameters<ServerResponse["writeHead"]>,
    );
  } as ServerResponse["writeHead"];

  ServerResponse.prototype.write = function write(
    this: BufferedResponse,
    ...args: Parameters<ServerResponse["write"]>
  ) {
    const chunk = args[0];
    const encoding = args[1];
    let enc: BufferEncoding | undefined;
    let done = args[2];
    if (typeof encoding === "function") done = encoding;
    else enc = encoding;

    if (!htmlResponses.has(this) && !isHtmlResponse(this)) {
      return originalWrite.apply(this, args);
    }

    if (!this.headersSent) this.removeHeader("content-length");
    const chunks = this[buffer] ?? [];
    this[buffer] = chunks;
    if (chunk) chunks.push(asBuffer(chunk, enc));
    done?.(null);
    return true;
  } as ServerResponse["write"];

  ServerResponse.prototype.end = function end(
    this: BufferedResponse,
    ...args: Parameters<ServerResponse["end"]>
  ) {
    const chunk = args[0];
    const encoding = args[1];
    let body: string | Uint8Array | undefined;
    let enc: BufferEncoding | undefined;
    let done = args[2];
    if (typeof chunk === "function") done = chunk;
    else body = chunk;
    if (typeof encoding === "function") done = encoding;
    else enc = encoding;

    const chunks = this[buffer];
    if (!htmlResponses.has(this) && !isHtmlResponse(this) && !chunks) {
      return originalEnd.apply(this, args);
    }
    if (this.headersSent && this.getHeader("content-length") != null) {
      return originalEnd.apply(this, args);
    }

    const parts = chunks ?? [];
    if (body) parts.push(asBuffer(body, enc));
    if (!this.headersSent) this.removeHeader("content-length");
    const html = deferDocumentScripts(Buffer.concat(parts).toString("utf8"));
    if (gzipResponses.has(this) || (!this.headersSent && acceptsGzip(this))) {
      if (!this.headersSent) {
        this.setHeader("content-encoding", "gzip");
        this.setHeader("vary", "accept-encoding");
      }
      const finish = originalEnd as (
        this: ServerResponse,
        chunk: Buffer,
        cb?: () => void,
      ) => ServerResponse;
      return finish.call(this, gzipSync(Buffer.from(html, "utf8")), done);
    }
    return originalEnd.call(this, html, "utf8", done);
  } as ServerResponse["end"];
}
