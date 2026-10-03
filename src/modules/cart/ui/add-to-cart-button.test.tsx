import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { AddToCartButton } from "@/modules/cart/ui/add-to-cart-button";
import { CartBadge } from "@/modules/cart/ui/cart-badge";
import { useCartStore } from "@/modules/cart/store/cart-store";

describe("add to cart", () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ lines: [], hasHydrated: true, announcement: "" });
  });

  it("increments the badge", async () => {
    const user = userEvent.setup();
    render(
      <>
        <AddToCartButton
          productId={4}
          title="Lámpara"
          image="/lamp.png"
          unitPrice={25}
        />
        <CartBadge />
      </>,
    );

    expect(screen.getByTestId("cart-badge")).toHaveTextContent("0");
    await user.click(
      screen.getByRole("button", { name: "Agregar al carrito" }),
    );
    expect(screen.getByTestId("cart-badge")).toHaveTextContent("1");
  });
});
