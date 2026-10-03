import { fireEvent, render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

import { ProductImage } from "@/shared/ui/product-image";

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    sizes,
    className,
    onError,
  }: ImgHTMLAttributes<HTMLImageElement>) => (
    // The mock stands in for next/image so the test can fire a load error.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      src={src}
      sizes={sizes}
      className={className}
      onError={onError}
    />
  ),
}));

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
