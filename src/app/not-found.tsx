import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-5xl">Esa página no está</h1>
      <p className="mt-3 text-muted">
        El enlace no lleva a ninguna parte de la tienda.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-accent-ink transition-[opacity,transform] duration-200 ease-out hover:opacity-90 active:scale-[0.98]"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
