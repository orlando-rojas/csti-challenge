import { createServer, request } from "node:http";
import type { AddressInfo } from "node:net";
import { gunzipSync } from "node:zlib";

import { describe, expect, it } from "vitest";

import { deferDocumentScripts } from "@/shared/lib/defer-document-scripts";
import { installDeferredDocumentScripts } from "@/shared/lib/install-deferred-document-scripts";

const document = `<!DOCTYPE html><html><head>
<script src="/_next/static/chunks/framework.js" async=""></script>
<script src="/_next/static/chunks/main.js" id="_R_" async=""></script>
<link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/main.js"/>
</head><body><h1>Norte</h1></body></html>`;

describe("deferDocumentScripts", () => {
  it("starts Next chunks on the frame after first paint", () => {
    const html = deferDocumentScripts(document);

    expect(html).not.toContain("/_next/static/chunks/");
    expect(html).not.toContain('rel="preload"');
    expect(html).toContain("setTimeout(()=>{for(const src of");
    expect(html).toContain(
      [..."/_next/static/chunks/framework.js"].reverse().join(""),
    );
    expect(html).toContain(
      [..."/_next/static/chunks/main.js"].reverse().join(""),
    );
    expect(html.indexOf("setTimeout")).toBeLessThan(html.indexOf("</body>"));
    expect(html).toContain("<h1>Norte</h1>");
  });

  it("hides chunk urls in flight data from the preload scanner", () => {
    const flight = `<script>self.__next_f.push([1,"[\\"/_next/static/chunks/app.js\\"]"])</script>`;
    const html = deferDocumentScripts(flight);
    expect(html).not.toContain("/_next/static/chunks/");
    expect(html).toContain("/_next/static/\\x63hunks/app.js");
  });

  it("leaves documents without Next chunks unchanged", () => {
    const plain = "<html><body><h1>Norte</h1></body></html>";
    expect(deferDocumentScripts(plain)).toBe(plain);
  });

  it("rewrites HTML responses from the Node server", async () => {
    installDeferredDocumentScripts();
    const server = createServer((_request, response) => {
      response.setHeader("content-type", "text/html; charset=utf-8");
      response.setHeader("content-length", Buffer.byteLength(document));
      response.writeHead(200);
      response.end(document);
    });
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const { port } = server.address() as AddressInfo;
    try {
      const html = await fetch(`http://127.0.0.1:${port}`).then((response) =>
        response.text(),
      );
      expect(html).not.toContain("/_next/static/chunks/");
      expect(html).toContain(
        [..."/_next/static/chunks/framework.js"].reverse().join(""),
      );
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });

  it("rewrites a document streamed after the headers", async () => {
    installDeferredDocumentScripts();
    const server = createServer((_request, response) => {
      response.setHeader("content-type", "text/html; charset=utf-8");
      response.writeHead(200);
      response.write(document.slice(0, 40));
      response.write(document.slice(40));
      response.end();
    });
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const { port } = server.address() as AddressInfo;
    try {
      const html = await fetch(`http://127.0.0.1:${port}`).then((response) =>
        response.text(),
      );
      expect(html).toContain("<h1>Norte</h1>");
      expect(html).not.toContain('src="/_next/static/chunks/');
      expect(html).toContain("setTimeout");
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });

  it("gzips the rewritten document when the browser accepts gzip", async () => {
    installDeferredDocumentScripts();
    const server = createServer((_request, response) => {
      response.setHeader("content-type", "text/html; charset=utf-8");
      response.writeHead(200);
      response.end(document);
    });
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const { port } = server.address() as AddressInfo;
    try {
      const { encoding, body } = await new Promise<{
        encoding: string | string[] | undefined;
        body: Buffer;
      }>((resolve, reject) => {
        const req = request(
          {
            hostname: "127.0.0.1",
            port,
            headers: { "accept-encoding": "gzip, deflate, br" },
          },
          (response) => {
            const chunks: Buffer[] = [];
            response.on("data", (chunk: Buffer) => chunks.push(chunk));
            response.on("end", () =>
              resolve({
                encoding: response.headers["content-encoding"],
                body: Buffer.concat(chunks),
              }),
            );
          },
        );
        req.on("error", reject);
        req.end();
      });
      expect(encoding).toBe("gzip");
      const html = gunzipSync(body).toString("utf8");
      expect(html).not.toContain('src="/_next/static/chunks/');
      expect(html).toContain("setTimeout");
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });
});
