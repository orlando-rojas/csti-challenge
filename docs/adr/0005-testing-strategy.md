# ADR 0005: Estrategia de pruebas

## Contexto

Hay que cubrir dominio, integración de UI y un recorrido de tienda sin convertir todo en E2E.

## Decisión

- Vitest sobre `cart/domain` y `catalog/application`, con umbral del 80% en líneas, ramas, funciones y sentencias.
- RTL para el botón de carrito y la búsqueda. MSW para el cliente HTTP y el fallback de la fixture.
- Playwright sobre la imagen de producción: filtro, búsqueda, orden, carrito, quick view, 404, meta/JSON-LD y axe.
- `contract.yml` valida Zod contra FakeStore y abre un issue si el contrato se rompe.

## Consecuencias

El E2E no corre en cada PR. Corre en `release.yml`, contra el contenedor, antes de publicar la imagen. Lighthouse CI exige Performance ≥ 95, LCP < 2.5 s y CLS < 0.05.
