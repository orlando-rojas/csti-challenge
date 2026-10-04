import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductImage } from "@/shared/ui/product-image";

describe("ProductImage", () => {
  it("replaces a failed photo with the fallback art", () => {
    const { container } = render(
      <div className="relative size-40">
        <ProductImage
          src="https://fakestoreapi.com/img/missing.png"
          alt="Mochila"
          sizes="160px"
        />
      </div>,
    );

    const photo = container.querySelector("img");
    if (!photo) throw new Error("missing photo");
    fireEvent.error(photo);

    expect(
      screen.getByRole("img", { name: "Imagen no disponible" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sin imagen")).toBeInTheDocument();
  });
});
