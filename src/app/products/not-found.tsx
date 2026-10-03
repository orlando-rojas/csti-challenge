import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-display text-5xl">Ese producto no está</h1>
      <p className="mt-3 text-muted">
        El identificador no corresponde a nada del catálogo.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-accent-ink"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
