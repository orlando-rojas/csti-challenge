import { describe, expect, it } from "vitest";

import {
  addItem,
  itemCount,
  migrateCart,
  removeItem,
  setQuantity,
  subtotal,
  type CartState,
} from "@/modules/cart/domain/cart";

const empty: CartState = { lines: [] };
const draft = {
  productId: 1,
  unitPrice: 10,
  title: "Taza",
  image: "/taza.png",
};

describe("cart domain", () => {
  it("adds a new line and increments an existing one", () => {
    const once = addItem(empty, draft);
    const twice = addItem(once, { ...draft, unitPrice: 12, qty: 2 });
    expect(twice.lines).toEqual([
      {
        productId: 1,
        qty: 3,
        unitPrice: 12,
        title: "Taza",
        image: "/taza.png",
      },
    ]);
    expect(itemCount(twice.lines)).toBe(3);
    expect(subtotal(twice.lines)).toBe(36);
  });

  it("caps quantity and removes a line at zero", () => {
    const added = addItem(empty, { ...draft, qty: 200 });
    expect(added.lines[0]?.qty).toBe(99);
    expect(setQuantity(added, 1, 0).lines).toEqual([]);
    expect(removeItem(added, 1).lines).toEqual([]);
    expect(setQuantity(added, 99, 2)).toEqual(added);
  });

  it("migrates only valid persisted lines", () => {
    expect(migrateCart(null, 1)).toEqual(empty);
    expect(migrateCart({ lines: "nope" }, 1)).toEqual(empty);
    expect(migrateCart({ lines: [{ productId: 1 }] }, 2)).toEqual(empty);
    expect(
      migrateCart(
        {
          lines: [draft && { ...draft, qty: 2 }, { productId: "x" }],
        },
        1,
      ).lines,
    ).toEqual([{ ...draft, qty: 2 }]);
  });
});
