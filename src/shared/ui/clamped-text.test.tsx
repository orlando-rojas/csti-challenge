import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ClampedText } from "@/shared/ui/clamped-text";

const title = "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops";

describe("ClampedText", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the full text on hover when the line clamp overflows", async () => {
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(72);
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(40);
    const user = userEvent.setup();

    render(
      <ClampedText as="h3" lines={2}>
        {title}
      </ClampedText>,
    );

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await user.hover(screen.getByRole("heading", { name: title }));
    expect(screen.getByRole("tooltip")).toHaveTextContent(title);
    await user.unhover(screen.getByRole("heading", { name: title }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("does not show a tooltip when the text fits", async () => {
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(40);
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(40);
    const user = userEvent.setup();

    render(<ClampedText lines={1}>Mochila</ClampedText>);

    await user.hover(screen.getByText("Mochila"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
