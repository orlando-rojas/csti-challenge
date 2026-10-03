# ADR 0001: Next.js 16 con Cache Components

## Contexto

La tienda necesita HTML de catálogo y ficha generado en el servidor, con caché de la API y partes dinámicas (búsqueda, carrito) sin convertir toda la ruta en dinámica.

## Decisión

Usamos Next.js 16.3 con `cacheComponents: true`, `"use cache"`, `cacheLife("hours")` y `cacheTag`. El spike cubrió la lectura cacheada de FakeStore, `Suspense` alrededor de `searchParams` y `params`, nuqs y un store de Zustand persistido. El build de producción con esa combinación es el criterio de éxito. No hizo falta caer al ISR clásico (`revalidate` / `dynamic`).

`preload` sustituye a `priority` en `next/image`. Las view transitions usan `<ViewTransition>` de React y no requieren flag en `next.config`. `middleware.ts` no se usa: en esta versión el reemplazo es `proxy.ts`, y no hay lógica de request que lo necesite.

## Consecuencias

Las rutas conocidas de producto se prerenderizan con `generateStaticParams`. Un id desconocido sigue resolviéndose en la petición y termina en `notFound()`. La revalidación puntual es `POST /api/revalidate` con `revalidateTag(tag, "max")`.
