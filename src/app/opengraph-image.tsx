import { ImageResponse } from "next/og";

export const alt = "Norte";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#1a1814",
        color: "#f4efe6",
        padding: 72,
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 6 }}>NORTE</div>
      <div style={{ fontSize: 76, marginTop: 24, maxWidth: 800 }}>
        Menos ruido. Mejores objetos.
      </div>
    </div>,
    size,
  );
}
