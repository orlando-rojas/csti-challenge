"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });

    if (navigator.sendBeacon("/api/vitals", body)) return;

    void fetch("/api/vitals", {
      method: "POST",
      body,
      keepalive: true,
      headers: { "content-type": "application/json" },
    });
  });

  return null;
}
