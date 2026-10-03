import { ImageResponse } from "next/og";

import { getProduct } from "@/modules/catalog";

export const alt = "Producto de Norte";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(Number(id));
  const title = product?.title ?? "Norte";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f4efe6",
        color: "#1a1814",
        padding: 64,
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 4 }}>NORTE</div>
      <div style={{ fontSize: 64, lineHeight: 1.05, maxWidth: 900 }}>
        {title}
      </div>
    </div>,
    size,
  );
}
