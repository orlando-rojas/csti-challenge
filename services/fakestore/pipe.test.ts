import { once } from "node:events";
import { createServer, type ServerResponse } from "node:http";
import { Readable } from "node:stream";
import type { AddressInfo } from "node:net";

import { describe, expect, it } from "vitest";

import { pipeToResponse } from "./pipe.mjs";

describe("image response", () => {
  it("stays up when the client closes the socket", async () => {
    const crashes: unknown[] = [];
    const onCrash = (error: unknown) => {
      crashes.push(error);
    };
    process.on("uncaughtException", onCrash);

    const server = createServer((_request, response: ServerResponse) => {
      pipeToResponse(Readable.from(Buffer.alloc(2 * 1024 * 1024, 1)), response);
    });

    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address() as AddressInfo;

    try {
      const controller = new AbortController();
      const response = await fetch(`http://127.0.0.1:${address.port}/`, {
        signal: controller.signal,
      });
      const reader = response.body?.getReader();
      const first = reader?.read();
      controller.abort();
      await first?.catch(() => undefined);
      await new Promise((resolve) => setTimeout(resolve, 50));
    } finally {
      server.close();
      await once(server, "close");
      process.off("uncaughtException", onCrash);
    }

    expect(crashes).toEqual([]);
  });
});
