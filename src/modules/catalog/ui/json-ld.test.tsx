import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "@/modules/catalog/ui/json-ld";

describe("JsonLd", () => {
  it("escapes characters that can break out of the script tag", () => {
    const name = "</script><script>alert(1)</script>&\u2028\u2029";
    const { container } = render(<JsonLd data={{ name }} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );

    expect(script?.textContent).not.toMatch(/[<>&\u2028\u2029]/);
    expect(JSON.parse(script?.textContent ?? "")).toEqual({ name });
  });
});
