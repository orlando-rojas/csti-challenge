import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import type { Product } from "@/modules/catalog/domain/product";
import { ProductDetail } from "@/modules/catalog/ui/product-detail";

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
  description: "Una mochila sobria para cargar poco y bien.".repeat(12),
  category: "men's clothing",
  image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
  price: { amount: 109.95, currency: "USD" },
  rating: { rate: 3.9, count: 120 },
};

describe("ProductDetail", () => {
  it("keeps the photo stage a fixed square so the shared transition does not stretch", () => {
    const { container } = render(
      <ProductDetail product={product} action={<button>Agregar</button>} />,
    );

    const stage = container.querySelector(".image-stage");
    expect(stage).toHaveClass(
      "aspect-square",
      "w-full",
      "max-w-[35rem]",
      "self-start",
      "justify-self-start",
    );
    expect(stage?.parentElement).toHaveClass("items-start");
  });
});
