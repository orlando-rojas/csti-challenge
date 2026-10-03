export type CartLine = {
  productId: number;
  qty: number;
  unitPrice: number;
  title: string;
  image: string;
};

export type CartDraft = {
  productId: number;
  unitPrice: number;
  title: string;
  image: string;
  qty?: number;
};

export type CartState = {
  lines: CartLine[];
};

const MAX_QTY = 99;

function clampQty(qty: number): number {
  return Math.min(MAX_QTY, Math.max(1, Math.trunc(qty)));
}

function isLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Partial<CartLine>;
  return (
    typeof line.productId === "number" &&
    typeof line.qty === "number" &&
    typeof line.unitPrice === "number" &&
    typeof line.title === "string" &&
    typeof line.image === "string"
  );
}

export function addItem(state: CartState, draft: CartDraft): CartState {
  const qty = clampQty(draft.qty ?? 1);
  const existing = state.lines.find(
    (line) => line.productId === draft.productId,
  );

  if (!existing) {
    return {
      lines: [
        ...state.lines,
        {
          productId: draft.productId,
          qty,
          unitPrice: draft.unitPrice,
          title: draft.title,
          image: draft.image,
        },
      ],
    };
  }

  return {
    lines: state.lines.map((line) =>
      line.productId === draft.productId
        ? {
            ...line,
            qty: clampQty(line.qty + qty),
            unitPrice: draft.unitPrice,
            title: draft.title,
            image: draft.image,
          }
        : line,
    ),
  };
}

export function setQuantity(
  state: CartState,
  productId: number,
  qty: number,
): CartState {
  if (qty <= 0) return removeItem(state, productId);
  return {
    lines: state.lines.map((line) =>
      line.productId === productId ? { ...line, qty: clampQty(qty) } : line,
    ),
  };
}

export function removeItem(state: CartState, productId: number): CartState {
  return { lines: state.lines.filter((line) => line.productId !== productId) };
}

export function itemCount(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.qty, 0);
}

export function subtotal(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.unitPrice * line.qty, 0);
}

export function migrateCart(persisted: unknown, version: number): CartState {
  if (version > 1 || !persisted || typeof persisted !== "object") {
    return { lines: [] };
  }

  const lines = (persisted as { lines?: unknown }).lines;
  if (!Array.isArray(lines)) return { lines: [] };

  return { lines: lines.filter(isLine) };
}
