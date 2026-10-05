<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Reglas no skipeables

Cada punto de este archivo es obligatorio. No se pospone, no se comenta, no se cubre con un `eslint-disable` y no se cambia por un atajo de Lighthouse, de bundle o de tiempo. Si una métrica choca con una regla, se ajusta la implementación. La regla se queda.

`next dev` solo reescribe el bloque entre `BEGIN:nextjs-agent-rules` y `END:nextjs-agent-rules`. El resto de este archivo se conserva. No borres estas reglas al tocar ese bloque.

Antes de cerrar un cambio, comprueba el HTML servido (no solo el render del cliente) de `/`, `/products` y `/products/[id]`.

## Reto técnico Delosi

Fuente: Fake Store. `GET /products`, `GET /products/:id`, `GET /products/categories`. La tienda solo cambia de host con `FAKESTORE_API_URL`. Las fotos del espejo público no se acoplan al stand-in local.

### Listado (`/products`)

- La carga y el filtrado inicial ocurren en el servidor, con Server Components. El HTML de la respuesta incluye las tarjetas (título, precio, foto y enlace a la ficha). Un skeleton de `Suspense` puede envolver la zona mientras llega, pero no puede ser el contenido final.
- Prohibido diferir la grilla a `useEffect`, a `next/dynamic` con `ssr: false` o a un import que solo corre al montar. `DeferredProductGrid` no se reintroduce.
- Los filtros de categoría son `<Link>` con search params. Sobreviven a la recarga, se pueden compartir y funcionan sin JavaScript.
- Hay búsqueda por texto y orden por criterio de negocio (precio). El estado de búsqueda, orden, categoría y página vive en la URL.

### Ficha (`/products/[id]`)

- La ruta es exactamente `/products/[id]`.
- `generateMetadata` arma título, descripción y Open Graph con los datos del producto.
- «Agregar al carrito» actualiza un estado global y el contador del header.

### Criterios de evaluación

- Performance: poco trabajo antes del primer render, CLS controlado, imágenes externas optimizadas y carga diferida de lo que no es LCP.
- Arquitectura: módulos por dominio, TypeScript estricto, SOLID. `src/app` solo entra por `src/modules/*/index.ts`.
- Estado del carrito justificado: hoy es Zustand en el cliente. No se mueve a cookie o Server Action sin un checkout real.
- Pruebas de los flujos de negocio: Vitest en dominio y aplicación (umbral 80 %), RTL + MSW en UI crítica, Playwright en la imagen de producción.

### Iniciativas que ya son parte del producto

No se quitan aunque el reto las marque como extra.

- `Suspense` y skeletons en home, listado, ficha y relacionados.
- `error.tsx`, `global-error.tsx`, `not-found` y empty state con salida.
- Caché con `"use cache"`, `cacheLife("hours")`, `cacheTag` y `POST /api/revalidate`.

## Contrato de la tienda

### Catálogo

- Home: hero (el mejor valorado), chips de categoría y cuatro destacados.
- Orden por defecto `rating`. Un `sort` inválido vuelve a `rating` y no se escribe en la URL. Claves: `price-asc`, `price-desc`, `rating`, `name`.
- Búsqueda sin tildes, debounce de 300 ms, `shallow: false` y `useTransition`.
- Paginación de 12 en el search param `page`. La página 1 no se serializa.
- Canonical de la PLP solo conserva `category` (y la página cuando no es la primera). Una URL con `q` lleva `noindex, follow`.
- JSON-LD `ItemList` en el listado. En la ficha, `Product` + `Offer` + `AggregateRating` y `BreadcrumbList`.
- `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `metadataBase` y `lang="es"`.
- `generateStaticParams` cubre los productos conocidos, también la vista previa. Un id inválido o ausente llama a `notFound()`.
- Relacionados: misma categoría, en streaming, sin la transición de título.
- La tarjeta abre `/products/[id]`. El icono de ojo abre `/products/[id]/preview` (`scroll={false}`). Al recargar el preview se ve la ficha completa.
- Al cambiar de categoría, un texto solo para lectores anuncia la carga y la grilla actual queda `aria-hidden`. No vuelve el overlay opaco de skeletons.
- Las fotos de producto descansan en un escenario blanco (`image-stage`) con relación de aspecto fija.

### Imágenes

- Toda foto de producto usa `next/image`. Prohibido un `<img>` de aplicación, una URL armada a mano de `/_next/image` y un `data:image/...;base64`.
- `preload` sustituye a `priority`. `preload` solo en el hero, las primeras cuatro tarjetas del listado y la foto de la ficha. El resto lleva `loading="lazy"`.
- `fill` + `sizes`. El padre es `relative`. `remotePatterns` cubre `fakestoreapi.com` y el espejo `raw.githubusercontent.com` de Fake Store. La fixture local es `/catalog/{id}.jpg`.
- Formatos del optimizador: WebP. No reactivar AVIF: el encode en frío del primer request empuja el LCP simulado por encima de 2,5 s.
- Si la foto falla, se muestra el arte «Sin imagen», con nombre accesible cuando el `alt` no está vacío.
- `sharp` sigue en la imagen Docker. En Alpine, `@img` no siempre se hoistea a `node_modules/@img`: copia el binding solo si existe.

### Carrito y chrome

- Zustand `persist` en `localStorage` (`norte-cart`, `version: 1`). El dominio es puro; el store solo orquesta. Se guarda `{ productId, qty, unitPrice, title, image }`.
- El badge reserva ancho fijo y muestra la cantidad después de rehidratar. El evento `storage` sincroniza pestañas. Hay toast descartable y anuncio `aria-live`.
- El drawer edita cantidades, muestra subtotal y anima la salida de una línea. No incluye un aviso de pago.
- La UI de catálogo no importa el carrito. La página pasa el botón como `action`.
- Modo oscuro con `next-themes`, sin parpadeo de texto que no cambió.
- Carrito y tema usan cursor pointer.
- View Transitions de React (`<ViewTransition>`), sin flag en `next.config`. El título solo se morphiza al abrir la ficha. Una tarjeta desplazada para el snapshot vuelve a su sitio en `pageshow`.
- Tipografía de sistema. No reintroducir `next/font` solo por el plan original: el CSS de Google retrasaba el primer paint.
- `experimental.inlineCss` se queda. Sin él, el stylesheet es el request que mete todos los scripts en el LCP simulado.
- En viewports angostos la página no se desplaza de lado.

### Datos y resiliencia

- Un solo fetch cacheado de productos y otro de categorías. Filtrar, buscar y ordenar son funciones puras: la API no lo hace.
- Timeout de catálogo 3 s y cero reintentos. Reintentar una lectura lenta tumba el build.
- Un throw dentro de `"use cache"` aborta el prerender aunque el llamador lo capture. La función cacheada devuelve una marca de no disponible (vida mínima de cinco minutos). Fuera de la caché, el repositorio registra `catalog.fallback.used`, escribe un `warn` y responde con la fixture validada por el mismo Zod. La fixture no se guarda como respuesta de la API.
- Un 404 de producto no usa la fixture: la ficha llama a `notFound()`.
- Prohibido un `Map` de promesas en vuelo compartido entre renders. En un contenedor frío deadlocké el fill de la caché y la ficha cayó en `error.tsx`.
- No hay Valkey. La caché es memoria más el volumen `.next/cache`.

### Límites

- Dominio no importa aplicación, infraestructura, UI ni otro módulo.
- Aplicación no importa infraestructura ni UI.
- UI no importa infraestructura.
- `middleware.ts` no existe. El reemplazo de esta versión es `proxy.ts`.
- `cacheComponents: true`. No volver a ISR clásico (`revalidate` / `dynamic`) sin una razón que estas reglas no cubran.
- El barrel de catálogo mezcla servidor y cliente. Solo lo importan Server Components.

### Calidad

- Interfaz en español. Código, comentarios y commits en inglés.
- Lighthouse CI, mediana de tres corridas: Performance ≥ 95, LCP < 2,5 s, CLS < 0,05. El tope de JS es un warn de 450 KB.
- Ese presupuesto no autoriza quitar HTML de servidor ni `next/image`.
- Playwright corre sobre la imagen de producción, en `release.yml`, no en cada PR. Cubre filtro, paginación, búsqueda, orden, carrito, quick view, 404, meta, JSON-LD y axe.
- axe espera el `h1` real. El skeleton está fuera del árbol de accesibilidad.
- Los locators de categoría y carrito no pueden coincidir también con una tarjeta. En el release fallaron en strict mode antes del reload.
- No pongas un `h3` directamente bajo un `h1`. axe lo marca como `heading-order`.
- `contract.yml` compara Zod con la API real. Un payload inválido abre issue; no se afloja el esquema para que pase.
- Storybook monta el app router y carga las fotos de demo.

### Despliegue

- Origen: Dokploy + Cloudflare Tunnel en `csti-challenge.orlando-rojas.com`. Vercel es un espejo con `SITE_INDEXABLE=false` y el mismo `NEXT_PUBLIC_SITE_URL` canónico.
- La imagen es standalone. `release.yml` publica en GHCR por SHA. El rollback es redesplegar el SHA anterior.
- Cloudflare cachea `/_next/static/*` un año y respeta el origen en `/_next/image*`. El HTML no se cachea en el borde.
- Storybook vive en un solo nivel de subdominio (`csti-challenge-storybook.orlando-rojas.com`). Universal SSL no cubre dos.
- `node:26-alpine` no trae corepack en el PATH: hay que instalarlo antes de `pnpm`.
- Node del proyecto `>= 24`. pnpm `10.15.1`.

## Aprendizajes de las sesiones

Estas son las formas en que el presupuesto de performance y los atajos ya rompieron el reto. No se repiten.

- El commit `732d22c` difirió la grilla al montaje y sustituyó `next/image` por un `<img>` con URLs manuales y por fotos en base64, para que Lighthouse no se pasara del presupuesto. El HTML vivo de `/products` quedó sin tarjetas. Eso incumple el requisito principal de Server Components y el ADR 0003 (la página funciona sin JavaScript).
- Inlinear la foto con `sharp` a `data:image/webp;base64` también abortó la ficha al abrirla desde el catálogo (`d95a800`): el `Map` de promesas en vuelo deadlocké `"use cache"`.
- El encode AVIF en frío del primer request fue lo que empujó el LCP simulado. El optimizador se quedó en WebP. Volver a AVIF exige medir de nuevo las tres corridas, no solo el caso caliente.
- `preload` en las cuatro primeras tarjetas existe porque la tercera foto del listado (arriba del pliegue) llegaba con `loading="lazy"` y Next la marcaba como LCP. No bajes `priorityCount` por debajo de 4 en la PLP.
- El hero y la ficha no aceptan un `image` o `imageSrc` alternativo. Ese hueco fue el que metió el base64 con `eslint-disable`.
- Un mock de `next/image` en un test puede renderizar un `<img>`. El código de la aplicación no.
- FakeStore a veces no responde. El build y el runtime tienen que seguir con la fixture. No conviertas ese fallo en un error de prerender.
- El stand-in local (`pnpm fakestore`, puerto 4010) sirve el mismo contrato. La tienda no debe importar su código; solo la URL.
- Los reportes de `/qa` viven fuera del repo (`.gstack/` está ignorado). Lo que sí se versiona es el test de regresión: cursor pointer en carrito y tema (ISSUE-001) y anuncio de carga al filtrar sin flash de skeleton (ISSUE-003). No borres esos tests.
- Playwright local apunta a localhost para que `next dev` pueda hidratar. El release apunta a la imagen.
- La mediana de tres corridas de Lighthouse es la que cuenta. Una corrida fría aislada no justifica recortar el HTML.
