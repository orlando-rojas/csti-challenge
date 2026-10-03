# Norte

Tienda de demostración para el reto Delosi. Catálogo de [FakeStore](https://fakestoreapi.com), fichas con SEO, carrito en el navegador y despliegue self-hosted.

- Tienda: https://csti-challenge.orlando-rojas.com
- Espejo (no indexable): el proyecto de Vercel que publica `release.yml`
- Storybook: https://csti-challenge-storybook.orlando-rojas.com

La interfaz está en español. El código y los commits, en inglés.

## Qué hay

- Home con hero, categorías y destacados por rating.
- PLP en `/products` con categoría en enlaces, búsqueda con debounce y orden.
- PDP en `/products/[id]` con metadata, JSON-LD, Open Graph y productos relacionados en streaming.
- Quick view: desde el catálogo el soft navigation abre un modal; al recargar se ve la ficha.
- Carrito persistido, sincronizado entre pestañas, con drawer.
- Modo oscuro y view transitions de la tarjeta a la ficha.

## Arquitectura

```text
src/app            rutas, SEO, health, vitals, revalidate
src/modules/catalog   dominio, filtro puro, FakeStore, UI
src/modules/cart      dominio puro, Zustand, UI
src/shared         http, logs, env, chrome de la página
```

La app solo importa `src/modules/*/index.ts`. El dominio no importa infraestructura. ESLint (`eslint-plugin-boundaries`) lo exige. Las decisiones están en `docs/adr`.

## Setup local

Requiere Node 24 y pnpm 10.

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

`.env.example` lista las variables. Sin `REVALIDATE_SECRET` el webhook de revalidación responde 401. Sin variables OTEL la app arranca y no exporta telemetría.

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
pnpm test:e2e
pnpm storybook
```

Docker:

```bash
docker build -t csti-challenge .
docker run --rm -p 3000:3000 -e HOSTNAME=0.0.0.0 csti-challenge
```

El volumen de Dokploy para la caché en disco es `/app/.next/cache`.

## Calidad

| Comando              | Qué cubre                                                                     |
| -------------------- | ----------------------------------------------------------------------------- |
| `pnpm test`          | Dominio, aplicación, esquemas, MSW y RTL. Umbral 80% en dominio y aplicación. |
| `pnpm test:contract` | Esquemas Zod contra FakeStore en vivo.                                        |
| `pnpm test:e2e`      | Playwright y axe. En release corre sobre la imagen.                           |

Lighthouse CI, en `release.yml`, falla si Performance baja de 95, el LCP pasa de 2.5 s o el CLS pasa de 0.05. Los puntajes de la última corrida quedan en el artefacto de ese workflow. `ANALYZE=true pnpm build` abre el analizador de bundle.

## Despliegue

Trunk-based. PRs cortos hacia `main`, CI en verde (`verify`: typecheck, lint, unit, build) y merge por squash. Protección recomendada de `main`: PR obligatorio, status check `verify`, sin force push. No hay previews de la integración Git de Vercel.

`release.yml` construye la imagen, corre E2E y Lighthouse, publica `ghcr.io/<repo>:<sha>` y, si existen los secretos, llama al webhook de Dokploy y hace `vercel deploy --prebuilt --prod`.

Rollback: en Dokploy, redesplegar el tag SHA anterior.

Cloudflare, en el túnel hacia Traefik:

- Cache Rule: `/_next/static/*` con TTL de borde de un año.
- `/_next/image*` respeta el `Cache-Control` de origen.
- El HTML no se cachea en el borde.
- SSL Full (strict), HSTS y Brotli.
- Storybook en el subdominio de un solo nivel `csti-challenge-storybook`.

En el espejo de Vercel: `NEXT_PUBLIC_SITE_URL` sigue siendo el dominio principal y `SITE_INDEXABLE=false`.

## Trade-offs

- El carrito vive en `localStorage`. Un carrito con cookie y Server Actions queda descrito en el ADR 0002 para cuando exista checkout.
- Filtros, búsqueda y orden ocurren en el servidor sobre el listado cacheado. Con 20 productos no hace falta paginación ni un índice.
- La fixture evita una página rota si FakeStore cae, y no se cachea como si fuera un 200. Puede quedar desactualizada; el contrato diario avisa.
- Una sola instancia. Valkey no está implementado.
- Los filtros de categoría son enlaces de servidor, no una isla de cliente, para que un crawler y un navegador sin JS puedan recorrerlos.

## Fuera de alcance

Valkey, Sentry, i18n, PWA y paginación.
