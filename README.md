# Norte — Tienda de demostración

Aplicación de comercio electrónico desarrollada como solución al **Reto Técnico 2026 de Delosi**. Consume el catálogo público de [FakeStore API](https://fakestoreapi.com) y ofrece listado de productos con filtros, fichas de producto optimizadas para SEO, carrito persistente en el navegador y un pipeline de despliegue self-hosted.

| Entorno                         | URL                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------ |
| Producción                      | [csti-challenge.orlando-rojas.com](https://csti-challenge.orlando-rojas.com)                     |
| Storybook                       | [csti-challenge-storybook.orlando-rojas.com](https://csti-challenge-storybook.orlando-rojas.com) |
| Espejo en Vercel (no indexable) | Proyecto de Vercel publicado por `release.yml`                                                   |

La interfaz está en español; el código, los comentarios y los mensajes de commit están en inglés.

## Tabla de contenidos

1. [Funcionalidades](#funcionalidades)
2. [Stack tecnológico](#stack-tecnológico)
3. [Arquitectura](#arquitectura)
4. [Requisitos previos](#requisitos-previos)
5. [Ejecución en entorno local](#ejecución-en-entorno-local)
6. [Variables de entorno](#variables-de-entorno)
7. [Scripts disponibles](#scripts-disponibles)
8. [Pruebas y calidad](#pruebas-y-calidad)
9. [Ejecución con Docker](#ejecución-con-docker)
10. [API interna](#api-interna)
11. [Integración y despliegue continuo](#integración-y-despliegue-continuo)
12. [Lineamientos de contribución](#lineamientos-de-contribución)
13. [Decisiones técnicas y trade-offs](#decisiones-técnicas-y-trade-offs)
14. [Solución de problemas](#solución-de-problemas)

## Funcionalidades

- **Home** con hero, accesos por categoría y productos destacados según su rating.
- **Listado de productos (PLP)** en `/products`: filtro por categoría mediante enlaces, búsqueda con debounce y ordenamiento. El estado se refleja en la URL.
- **Ficha de producto (PDP)** en `/products/[id]`: metadata dinámica, datos estructurados JSON-LD, imágenes Open Graph y productos relacionados cargados en streaming.
- **Vista rápida**: el icono de vista previa abre la ficha en un modal (rutas interceptadas). El resto de la tarjeta abre la ficha completa; al recargar la vista previa también se muestra la ficha.
- **Carrito** persistido en `localStorage`, sincronizado entre pestañas y presentado en un drawer lateral.
- **Modo oscuro** y **View Transitions** entre la tarjeta del producto y su ficha.
- **SEO técnico**: `sitemap.xml`, `robots.txt` y URL canónica configurables por entorno.
- **Observabilidad**: logs estructurados, trazas y métricas OpenTelemetry, y recolección de Web Vitals.

## Stack tecnológico

| Área                | Tecnología                                                                    |
| ------------------- | ----------------------------------------------------------------------------- |
| Framework           | Next.js 16 (App Router, Cache Components), React 19, React Compiler           |
| Lenguaje            | TypeScript                                                                    |
| Estilos y UI        | Tailwind CSS 4, Radix UI, shadcn/ui, lucide-react                             |
| Estado              | Zustand (carrito), nuqs (estado en la URL)                                    |
| Validación          | Zod, `@t3-oss/env-nextjs` (variables de entorno tipadas)                      |
| Observabilidad      | Pino, OpenTelemetry (`@vercel/otel`)                                          |
| Pruebas             | Vitest, Testing Library, MSW, Playwright, axe-core, Lighthouse CI             |
| Documentación de UI | Storybook 10                                                                  |
| Calidad de código   | ESLint (`eslint-plugin-boundaries`), Prettier, Husky, lint-staged, commitlint |
| Infraestructura     | Docker, GitHub Actions, GHCR, Dokploy, Cloudflare, Vercel                     |

## Arquitectura

El proyecto sigue una arquitectura modular por dominio, con capas separadas dentro de cada módulo:

```text
src/
├── app/                  Rutas, layouts, SEO, endpoints (health, vitals, revalidate)
├── modules/
│   ├── catalog/          domain · application · infrastructure (FakeStore) · ui
│   └── cart/             domain · store (Zustand) · ui
├── shared/               Cliente HTTP, logger, configuración de entorno, layout común
├── test/                 Utilidades y configuración de pruebas
├── instrumentation.ts    Inicialización de OpenTelemetry
└── proxy.ts              Proxy de Next.js
```

Reglas de dependencia, verificadas por ESLint mediante `eslint-plugin-boundaries`:

- `src/app` solo importa la API pública de cada módulo (`src/modules/*/index.ts`).
- La capa de dominio no depende de infraestructura ni de UI.
- Los módulos no acceden a los internos de otros módulos.

Las decisiones de arquitectura están documentadas como ADR en [`docs/adr`](docs/adr):

| ADR                                                    | Tema                                       |
| ------------------------------------------------------ | ------------------------------------------ |
| [0001](docs/adr/0001-cache-components.md)              | Cache Components                           |
| [0002](docs/adr/0002-cart-state.md)                    | Estado del carrito                         |
| [0003](docs/adr/0003-url-state-nuqs.md)                | Estado en la URL con nuqs                  |
| [0004](docs/adr/0004-server-filtering-and-fallback.md) | Filtrado en servidor y fixture de respaldo |
| [0005](docs/adr/0005-testing-strategy.md)              | Estrategia de pruebas                      |
| [0006](docs/adr/0006-module-boundaries.md)             | Límites entre módulos                      |
| [0007](docs/adr/0007-self-hosted-deploy.md)            | Despliegue self-hosted                     |
| [0008](docs/adr/0008-observability.md)                 | Observabilidad                             |

## Requisitos previos

| Herramienta | Versión  | Notas                                                                 |
| ----------- | -------- | --------------------------------------------------------------------- |
| Node.js     | ≥ 24     | Definido en `engines` de `package.json`.                              |
| pnpm        | 10.15.1  | Se recomienda activarlo con Corepack: `corepack enable`.              |
| Git         | Reciente | Necesario para clonar el repositorio y para los hooks de Husky.       |
| Docker      | Opcional | Solo para ejecutar la imagen de producción o Storybook en contenedor. |

Verificación rápida:

```bash
node --version   # v24.x
pnpm --version   # 10.15.1
```

> En Windows se recomienda trabajar dentro de WSL 2. Algunos scripts (por ejemplo `pnpm analyze`) usan sintaxis de shell POSIX.

## Ejecución en entorno local

### 1. Clonar el repositorio

```bash
git clone https://github.com/orlando-rojas/csti-challenge.git
cd csti-challenge
```

### 2. Activar pnpm e instalar dependencias

```bash
corepack enable
pnpm install
```

La instalación ejecuta `prepare`, que registra los hooks de Git de Husky (lint-staged en pre-commit y commitlint en commit-msg).

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Los valores por defecto permiten ejecutar la aplicación sin cambios. Para desarrollo local se recomienda apuntar la URL canónica a localhost:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Consulta [Variables de entorno](#variables-de-entorno) para el detalle de cada una.

### 4. Sustituto local de FakeStore (opcional)

`https://fakestoreapi.com` a veces no responde. `pnpm fakestore` levanta un servicio en [http://localhost:4010](http://localhost:4010) con los mismos endpoints que usa la tienda: `GET /products`, `GET /products/categories` y `GET /products/:id`. El catálogo sale de la fixture del repositorio. En el primer arranque descarga las fotos del repositorio público de Fake Store y las guarda en `services/fakestore/img` (esa carpeta no se versiona).

En `.env.local`:

```dotenv
FAKESTORE_API_URL=http://localhost:4010
```

En otra terminal:

```bash
pnpm fakestore
```

El puerto se cambia con `FAKESTORE_PORT`. En desarrollo, Next acepta las imágenes de ese origen. El valor por defecto de producción sigue siendo `https://fakestoreapi.com`. Cuando la API pública vuelva, quita `FAKESTORE_API_URL` de `.env.local` y reinicia `pnpm dev`.

### 5. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

La aplicación queda disponible en [http://localhost:3000](http://localhost:3000).

### 6. Ejecutar el build de producción en local (opcional)

```bash
pnpm build
pnpm start
```

### 7. Ejecutar Storybook (opcional)

```bash
pnpm storybook
```

Storybook queda disponible en [http://localhost:6006](http://localhost:6006).

## Variables de entorno

Las variables se validan al arrancar con Zod en [`src/shared/config/env.ts`](src/shared/config/env.ts). Si un valor no cumple el esquema, la aplicación no inicia. Las cadenas vacías se tratan como no definidas.

| Variable                      | Requerida | Valor por defecto                          | Descripción                                                                                         |
| ----------------------------- | --------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`        | No        | `https://csti-challenge.orlando-rojas.com` | Origen canónico usado en metadata, sitemap y Open Graph. Se incrusta en el bundle durante el build. |
| `SITE_INDEXABLE`              | No        | `true`                                     | `false` agrega `noindex` y bloquea el rastreo (se usa en el espejo de Vercel).                      |
| `FAKESTORE_API_URL`           | No        | `https://fakestoreapi.com`                 | URL base de la API de catálogo. En local puede ser `http://localhost:4010` (`pnpm fakestore`).      |
| `REVALIDATE_SECRET`           | No        | —                                          | Secreto (mínimo 8 caracteres) para `POST /api/revalidate`. Sin él, el endpoint responde `401`.      |
| `LOG_LEVEL`                   | No        | `info`                                     | Nivel de Pino: `fatal`, `error`, `warn`, `info`, `debug`, `trace` o `silent`.                       |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | No        | —                                          | Endpoint OTLP (por ejemplo, Grafana Cloud). Sin él, no se exporta telemetría.                       |
| `OTEL_EXPORTER_OTLP_HEADERS`  | No        | —                                          | Cabeceras de autenticación del exportador OTLP.                                                     |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | No        | `http/protobuf`                            | Protocolo del exportador OTLP.                                                                      |
| `SKIP_ENV_VALIDATION`         | No        | —                                          | `true` omite la validación (solo para builds de herramientas, no para ejecución).                   |

## Scripts disponibles

| Script                 | Descripción                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `pnpm dev`             | Servidor de desarrollo con recarga en caliente.              |
| `pnpm fakestore`       | Sustituto local de FakeStore en el puerto 4010.              |
| `pnpm build`           | Build de producción (salida `standalone`).                   |
| `pnpm start`           | Sirve el build de producción.                                |
| `pnpm typecheck`       | Verificación de tipos con `tsc --noEmit`.                    |
| `pnpm lint`            | ESLint, incluidas las reglas de límites entre módulos.       |
| `pnpm format`          | Formatea el código con Prettier.                             |
| `pnpm format:check`    | Comprueba el formato sin modificar archivos.                 |
| `pnpm test`            | Pruebas unitarias y de integración con cobertura.            |
| `pnpm test:watch`      | Vitest en modo observación.                                  |
| `pnpm test:contract`   | Pruebas de contrato contra FakeStore en vivo (requiere red). |
| `pnpm test:e2e`        | Pruebas end-to-end con Playwright.                           |
| `pnpm storybook`       | Storybook en el puerto 6006.                                 |
| `pnpm build-storybook` | Genera Storybook estático en `storybook-static/`.            |
| `pnpm analyze`         | Build con el analizador de bundle.                           |

## Pruebas y calidad

### Pruebas unitarias y de integración

```bash
pnpm test
```

Cubren dominio, casos de uso, esquemas Zod y componentes (Testing Library con MSW para simular FakeStore). El umbral mínimo de cobertura es **80 %** en las capas de dominio y aplicación. El reporte se genera en `coverage/`.

### Pruebas de contrato

```bash
pnpm test:contract
```

Validan los esquemas Zod contra la respuesta real de FakeStore. En CI se ejecutan a diario y abren un issue automáticamente si el contrato se rompe.

### Pruebas end-to-end

La primera vez, instala el navegador de Playwright:

```bash
pnpm exec playwright install --with-deps chromium
```

Luego ejecuta:

```bash
pnpm test:e2e
```

Por defecto, Playwright levanta `pnpm dev` y reutiliza un servidor ya iniciado en el puerto 3000. Para probar contra otra instancia, como el contenedor Docker, define `PLAYWRIGHT_BASE_URL`:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000 pnpm test:e2e
```

Las pruebas incluyen auditorías de accesibilidad con axe-core.

### Presupuestos de rendimiento

Lighthouse CI se ejecuta en `release.yml` sobre la imagen de producción y falla si:

- Performance es menor a 95.
- LCP supera 2,5 s.
- CLS supera 0,05.

Los resultados de cada ejecución quedan como artefacto del workflow.

### Verificación completa antes de abrir un PR

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

Es la misma secuencia que ejecuta el job `verify` en CI.

## Ejecución con Docker

### Aplicación

```bash
docker build -t csti-challenge .
docker run --rm -p 3000:3000 csti-challenge
```

Para cambiar la URL canónica, pásala como argumento de build, ya que se incrusta en el bundle:

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3000 -t csti-challenge .
```

El resto de las variables se pasan en tiempo de ejecución con `-e` o `--env-file .env.local`. La imagen se ejecuta con un usuario sin privilegios, expone el puerto `3000` e incluye un `HEALTHCHECK` sobre `/api/health`. Para conservar la caché entre despliegues, monta un volumen en `/app/.next/cache`.

### Storybook

```bash
docker build -f Dockerfile.storybook -t csti-challenge-storybook .
docker run --rm -p 6006:80 csti-challenge-storybook
```

## API interna

| Método | Ruta              | Descripción                                                                                                                               |
| ------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/api/health`     | Estado del servicio. Lo usan el healthcheck de Docker y el smoke test del despliegue.                                                     |
| `POST` | `/api/vitals`     | Recibe métricas Web Vitals desde el navegador.                                                                                            |
| `POST` | `/api/revalidate` | Invalida la caché del catálogo. Requiere la cabecera `x-revalidate-secret`. Acepta `{ "tag": "products" }` o `{ "tag": "product:<id>" }`. |

Ejemplo de revalidación en local:

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -d '{"tag":"product:1"}'
```

## Integración y despliegue continuo

| Workflow        | Disparador                      | Responsabilidad                                                                                 |
| --------------- | ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `ci.yml`        | PR y push a `main`              | Job `verify`: typecheck, lint, pruebas unitarias y build.                                       |
| `release.yml`   | Push a `main`                   | Construye la imagen, ejecuta E2E y Lighthouse, publica en GHCR y despliega en Dokploy y Vercel. |
| `contract.yml`  | Diario y manual                 | Pruebas de contrato contra FakeStore; abre un issue si fallan.                                  |
| `storybook.yml` | Push a `main` con cambios de UI | Build y publicación de Storybook.                                                               |

**Flujo de release:** la imagen se publica como `ghcr.io/orlando-rojas/csti-challenge:<sha>` y `:latest`. Si los secretos están configurados, el workflow llama al webhook de Dokploy, ejecuta un smoke test sobre el dominio principal y publica el espejo con `vercel deploy --prebuilt --prod`.

**Rollback:** en Dokploy, redesplegar la imagen con el tag SHA anterior.

**Borde (Cloudflare, mediante túnel hacia Traefik):**

- `/_next/static/*` se cachea en el borde durante un año.
- `/_next/image*` respeta el `Cache-Control` del origen.
- El HTML no se cachea en el borde.
- SSL Full (strict), HSTS y Brotli activados.

**Espejo en Vercel:** `NEXT_PUBLIC_SITE_URL` apunta al dominio principal y `SITE_INDEXABLE=false`, para no competir en buscadores.

## Lineamientos de contribución

- **Flujo trunk-based:** ramas de vida corta, PRs pequeños hacia `main` y merge por squash.
- **Protección de `main`:** PR obligatorio, status check `verify` en verde y sin force push.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/), validados por commitlint (por ejemplo, `feat(cart): persist quantity across tabs`).
- **Formato y lint:** lint-staged aplica ESLint y Prettier a los archivos en stage antes de cada commit.
- **Nuevas decisiones de arquitectura:** documentarlas como ADR en `docs/adr`, siguiendo la numeración existente.

## Decisiones técnicas y trade-offs

- **Carrito en `localStorage`.** Es suficiente sin checkout. La alternativa con cookie y Server Actions está descrita en el [ADR 0002](docs/adr/0002-cart-state.md).
- **Filtrado, búsqueda, orden y paginación en el servidor.** La interfaz recibe una página del resultado. La fuente actual no ofrece `limit`/`offset`; cuando lo haga, el corte se mueve al repositorio sin cambiar la URL.
- **Fixture de respaldo.** Si FakeStore no responde, se sirve una fixture local que no se cachea como una respuesta válida. Puede desactualizarse; las pruebas de contrato diarias lo detectan.
- **Filtros de categoría como enlaces de servidor**, no como componente de cliente, para que buscadores y navegadores sin JavaScript puedan recorrerlos.
- **Una sola instancia.** No hay caché distribuida; Valkey queda como evolución futura.

### Fuera de alcance

Valkey, Sentry, internacionalización y PWA.

## Solución de problemas

| Síntoma                                     | Causa probable y solución                                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Error de validación de variables al iniciar | Algún valor de `.env.local` no cumple el esquema (por ejemplo, una URL mal formada). Revisa la tabla de variables.              |
| `POST /api/revalidate` responde `401`       | `REVALIDATE_SECRET` no está definido o la cabecera `x-revalidate-secret` no coincide.                                           |
| Playwright no encuentra el navegador        | Ejecuta `pnpm exec playwright install --with-deps chromium`.                                                                    |
| El puerto 3000 está ocupado                 | Detén el proceso que lo usa o inicia con `pnpm dev -p 3001`.                                                                    |
| `pnpm` no reconoce la versión               | Ejecuta `corepack enable` para usar la versión definida en `packageManager`.                                                    |
| El catálogo muestra datos de respaldo       | FakeStore no está disponible. Ejecuta `pnpm fakestore`, define `FAKESTORE_API_URL=http://localhost:4010` y reinicia `pnpm dev`. |
