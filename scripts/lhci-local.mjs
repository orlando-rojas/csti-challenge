/**
 * Runs the same Lighthouse assertions as lighthouserc.cjs against a server
 * that is already listening on 127.0.0.1:3000.
 *
 * `pnpm exec lhci autorun` cannot launch Chrome in this WSL environment:
 * chrome-launcher tries to create its profile on a Windows temp path.
 * This script starts Playwright's Chromium itself and points Lighthouse at
 * that debugging port. Collection is unthrottled and then simulated with
 * Lighthouse's mobile preset, which is what CI does.
 *
 *   pnpm build && pnpm start
 *   pnpm lhci:local
 *
 * Dev-server numbers are not comparable to the release job.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createServer } from "node:net";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const config = require("../lighthouserc.cjs");
const lighthouse = require(
  "../node_modules/.pnpm/lighthouse@12.6.1/node_modules/lighthouse/core/index.js",
).default;

const urls = process.env.LHCI_URLS
  ? process.env.LHCI_URLS.split(",")
  : config.ci.collect.url;
const assertions = config.ci.assert.assertions;

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() => resolve(port));
    });
  });
}

async function waitForChrome(port) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {
      // Chrome is still starting.
    }
    await delay(100);
  }
  throw new Error(`Chrome did not open a debugging port on ${port}`);
}

function check(auditId, audit, assertion) {
  const [level, options] = assertion;
  if (level === "off" || !audit) return null;

  if (options.minScore != null) {
    const score = audit.score ?? 0;
    if (score < options.minScore) {
      return `${auditId} ${score} < ${options.minScore}`;
    }
    return null;
  }

  const value = audit.numericValue ?? 0;
  if (options.maxNumericValue != null && value > options.maxNumericValue) {
    const message = `${auditId} ${Math.round(value)} > ${options.maxNumericValue}`;
    return level === "warn" ? null : message;
  }
  return null;
}

const failures = [];
const port = await freePort();
const userDataDir = await mkdtemp(join(tmpdir(), "lhci-local-"));
const chrome = spawn(
  chromium.executablePath(),
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

try {
  const health = await fetch("http://127.0.0.1:3000/api/health").catch(
    () => null,
  );
  if (!health?.ok) {
    throw new Error(
      "Nothing healthy is listening on http://127.0.0.1:3000. Start the production server with `pnpm build && pnpm start`.",
    );
  }

  await waitForChrome(port);

  for (const url of urls) {
    await fetch(url).catch(() => null);
    const result = await lighthouse(url, {
      port,
      logLevel: "error",
      onlyCategories: ["performance"],
    });
    const lhr = result.lhr;
    const audits = lhr.audits;
    if (
      lhr.runtimeError ||
      audits["cumulative-layout-shift"]?.numericValue == null
    ) {
      console.error(
        `${url}  lighthouse incomplete`,
        lhr.runtimeError?.code ?? "",
        lhr.runtimeError?.message ?? "",
        audits["cumulative-layout-shift"]?.errorMessage ?? "missing CLS",
      );
    }
    const performance = lhr.categories.performance.score;
    const lcp = Math.round(audits["largest-contentful-paint"].numericValue);
    const tbt = Math.round(audits["total-blocking-time"].numericValue);
    const cls = Number(
      (audits["cumulative-layout-shift"]?.numericValue ?? 0).toFixed(4),
    );
    const observed = Math.round(
      audits.metrics?.details?.items?.[0]?.observedLargestContentfulPaint ??
        -1,
    );
    const lcpNode =
      audits["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]
        ?.node?.nodeLabel ?? "";
    const phases = (
      audits["largest-contentful-paint-element"]?.details?.items?.[1]?.items ??
      []
    )
      .map((item) => `${item.phase} ${Math.round(item.timing)}`)
      .join(" | ");
    const chain = audits["critical-request-chains"]?.details?.longestChain;
    console.log(
      `${url}  score ${performance}  LCP ${lcp}  TBT ${tbt}  CLS ${cls}  observed ${observed}  chain ${chain?.length ?? "?"}  lcp ${JSON.stringify(lcpNode)}`,
    );
    if (phases) console.log(`  phases ${phases}`);

    const scored = {
      "categories:performance": { score: performance },
      "largest-contentful-paint": audits["largest-contentful-paint"],
      "cumulative-layout-shift": audits["cumulative-layout-shift"],
      "resource-summary:script:size": audits["resource-summary:script:size"],
    };
    for (const [id, assertion] of Object.entries(assertions)) {
      const failure = check(id, scored[id], assertion);
      if (failure) failures.push(`${url}  ${failure}`);
    }
  }
} finally {
  if (chrome.exitCode == null && chrome.signalCode == null) {
    chrome.kill();
    await Promise.race([
      new Promise((resolve) => chrome.once("exit", resolve)),
      delay(1000),
    ]);
  }
  await rm(userDataDir, { recursive: true, force: true }).catch(() => null);
}

if (failures.length > 0) {
  console.error("\nLighthouse assertions failed:");
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
