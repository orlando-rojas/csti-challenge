# ADR 0004: Filtrado en el servidor y fallback

## Contexto

FakeStore expone `/products` y `/products/categories`, sin búsqueda ni orden. El catálogo tiene 20 productos.

## Decisión

Hay un fetch cacheado del listado y otro de categorías. Filtrar, buscar sin tildes y ordenar son funciones puras en `catalog/application`. El orden es un `Record<SortKey, Comparator>`.

Si la llamada cacheada falla por red, 5xx o payload inválido, el repositorio registra `catalog.fallback.used`, escribe un log `warn` y responde con la fixture validada por el mismo esquema Zod. El fallback queda fuera de `"use cache"` para no congelar una respuesta de error durante horas. Un 404 de producto no usa la fixture: la ficha llama a `notFound()`.

## Consecuencias

La fixture puede quedar atrás de la API. El workflow `contract.yml` compara el esquema con la API real cada día. Valkey y `cacheHandlers` quedan fuera: una instancia y el disco de `.next/cache` alcanzan para este catálogo.
