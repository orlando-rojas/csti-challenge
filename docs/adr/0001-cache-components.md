# ADR 0001: Next.js 16 con Cache Components

## Contexto

La tienda necesita HTML de catálogo y ficha generado en el servidor, con caché de la API y partes dinámicas (búsqueda, carrito) sin convertir toda la ruta en dinámica.

## Decisión

Usamos Next.js 16.3 con `cacheComponents: true`, `"use cache"`, `cacheLife("hours")` y `cacheTag`. El spike cubrió la lectura cacheada de FakeStore, `Suspense` alrededor de `searchParams` y `params`, nuqs y un store de Zustand persistido. El build de producción con esa combinación es el criterio de éxito. No hizo falta caer al ISR clásico (`revalidate` / `dynamic`).

`preload` sustituye a `priority` en `next/image`. Las view transitions usan `<ViewTransition>` de React y no requieren flag en `next.config`. `middleware.ts` no existe: en esta versión el reemplazo es `proxy.ts`.

`proxy.ts` corre antes de la ruta, solo en `/products/:id` y `/products/:id/preview`. No puede leer `"use cache"`, así que la membresía del status sale de los ids de la fixture (`product-ids.ts`), no del listado vivo. Con PPR el shell de una ficha inexistente ya salió con 200 cuando `notFound()` corre dentro de `Suspense`; el proxy reescribe un id que no está en esa lista a `/producto-inexistente` y Next responde 404 sin cambiar la URL. La página sigue decidiendo si el producto existe con el listado vivo. Una navegación de documento a la vista previa (`Accept: text/html`) responde 308 a la ficha, con `Cache-Control: no-store`: recargar o compartir el enlace muestra la PDP, y el navegador no aplica esa redirección a las peticiones del router que abren el modal.

## Consecuencias

Las rutas conocidas de producto se prerenderizan con `generateStaticParams`, también la vista previa. Un id inválido o ausente de la fixture no llega a la ficha. La revalidación puntual es `POST /api/revalidate` con `revalidateTag(tag, "max")`.
