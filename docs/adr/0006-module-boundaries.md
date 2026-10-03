# ADR 0006: Límites entre módulos

## Contexto

El reto pide una arquitectura que se pueda defender, no solo carpetas ordenadas.

## Decisión

`catalog` y `cart` se parten en dominio, aplicación, infraestructura y UI. `eslint-plugin-boundaries` impide que el dominio importe hacia afuera, que la aplicación importe infraestructura, y que la UI importe infraestructura. La app solo entra por `modules/*/index.ts`.

`ProductRepository` vive en la aplicación. `FakeStoreRepository` lo implementa. `src/modules/catalog/index.ts` es el composition root: une el repositorio con las funciones puras. La UI del catálogo no importa el carrito; la página le pasa el botón como `action`.

## Consecuencias

Agregar otra fuente de productos no obliga a tocar el filtrado ni las tarjetas. El barrel mezcla exports de servidor y de cliente; las páginas de servidor son las únicas que lo importan.
