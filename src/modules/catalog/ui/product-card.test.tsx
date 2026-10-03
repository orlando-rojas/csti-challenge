import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Product } from "@/modules/catalog/domain/product";
import { ProductCard } from "@/modules/catalog/ui/product-card";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    ViewTransition: ({ children }: { children: React.ReactNode }) => children,
  };
});

const product: Product = {
  id: 1,
  title: "Mochila para el día a día",
  description: "Una mochila sobria para cargar poco y bien.",
  category: "men's clothing",
  image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
  price: { amount: 109.95, currency: "USD" },
  rating: { rate: 3.9, count: 120 },
};

describe("ProductCard", () => {
  it("sends the card to the product page and the preview control to the modal route", () => {
    render(<ProductCard product={product} />);

    const detail = screen
      .getByRole("heading", { name: product.title })
      .closest("a");
    const preview = screen.getByTestId("product-preview");

    expect(detail).toHaveAttribute("href", "/products/1");
    expect(preview).toHaveAttribute("href", "/products/1/preview");
    expect(preview).toHaveAttribute(
      "aria-label",
      "Vista previa de Mochila para el día a día",
    );
    expect(detail).not.toContainElement(preview);
  });
});
