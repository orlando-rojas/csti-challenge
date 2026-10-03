"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f4efe6",
          color: "#1a1814",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 48, marginBottom: 12 }}>Algo se rompió</h1>
          <button
            type="button"
            onClick={reset}
            style={{
              border: 0,
              borderRadius: 999,
              background: "#8a3d1e",
              color: "#fff8f3",
              padding: "12px 20px",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
