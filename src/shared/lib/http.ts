import "server-only";

import { SpanStatusCode, getTracer } from "@/shared/lib/telemetry";

export class ApiError extends Error {
  readonly status: number;
  readonly retryable: boolean;

  constructor(message: string, status: number, retryable: boolean) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryable = retryable;
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404, false);
    this.name = "NotFoundError";
  }
}

type HttpGetOptions = {
  retries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryable(error: unknown): boolean {
  if (error instanceof NotFoundError) return false;
  if (error instanceof ApiError) return error.retryable;
  return true;
}

export async function httpGet(
  url: string,
  options: HttpGetOptions = {},
): Promise<unknown> {
  const retries = options.retries ?? 2;
  const retryDelayMs = options.retryDelayMs ?? 100;
  const timeoutMs = options.timeoutMs ?? 5_000;
  const tracer = getTracer();

  return tracer.startActiveSpan("catalog.http.get", async (span) => {
    span.setAttribute("http.request.method", "GET");
    span.setAttribute("url.full", url);

    try {
      let attempt = 0;
      let lastError: unknown;

      while (attempt <= retries) {
        try {
          const response = await fetch(url, {
            signal: AbortSignal.timeout(timeoutMs),
            headers: {
              accept: "application/json",
              "user-agent": "csti-challenge",
            },
          });
          span.setAttribute("http.response.status_code", response.status);
          span.setAttribute("http.retry_count", attempt);

          if (response.status === 404) {
            await response.body?.cancel().catch(() => undefined);
            throw new NotFoundError(`Not found: ${url}`);
          }

          if (!response.ok) {
            await response.body?.cancel().catch(() => undefined);
            throw new ApiError(
              `Request failed with status ${response.status}`,
              response.status,
              response.status >= 500,
            );
          }

          const text = await response.text();
          try {
            return JSON.parse(text) as unknown;
          } catch {
            throw new ApiError(
              `Response was not JSON (${response.status})`,
              response.status,
              true,
            );
          }
        } catch (error) {
          lastError = error;
          if (!isRetryable(error) || attempt === retries) {
            throw error;
          }
          await sleep(retryDelayMs * 2 ** attempt);
          attempt += 1;
        }
      }

      throw lastError;
    } catch (error) {
      if (error instanceof Error) span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}
