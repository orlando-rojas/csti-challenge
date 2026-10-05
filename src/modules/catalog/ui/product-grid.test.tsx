import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import type { Product } from "@/modules/catalog/domain/product";
import { ProductGrid } from "@/modules/catalog/ui/product-grid";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    ViewTransition: ({ children }: { children?: ReactNode }) => children,
  };
});

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

const product: Product = {
  id: 1,
  title: "Mochila para el día a día",
  description: "Una mochila sobria para cargar poco y bien.",
  category: "men's clothing",
  image: "/catalog/1.jpg",
  price: { amount: 109.95, currency: "USD" },
  rating: { rate: 3.9, count: 120 },
};

describe("ProductGrid", () => {
  it("includes each product card in the first render", () => {
    render(<ProductGrid products={[product]} />);

    expect(screen.getByTestId("product-card")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: product.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: product.title })).toHaveAttribute(
      "src",
      product.image,
    );
  });
});
