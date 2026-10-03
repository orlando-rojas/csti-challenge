# ADR 0004: Filtrado en el servidor y fallback

## Contexto

FakeStore expone `/products` y `/products/categories`, sin búsqueda ni orden. El catálogo tiene 20 productos.

## Decisión

Hay un fetch cacheado del listado y otro de categorías. Filtrar, buscar sin tildes y ordenar son funciones puras en `catalog/application`. El orden es un `Record<SortKey, Comparator>`.

Si la llamada cacheada falla por red, 4xx distinto de 404, 5xx o payload inválido, no se relanza: un error dentro de `"use cache"` aborta el prerender aunque el llamador lo capture. La función devuelve una marca de no disponible con vida de cinco minutos (el mínimo que el shell estático conserva) y el repositorio, fuera de la caché, registra `catalog.fallback.used`, escribe un log `warn` y responde con la fixture validada por el mismo esquema Zod. La fixture no se guarda como respuesta de la API. Un 404 de producto no usa la fixture: la ficha llama a `notFound()`.

## Consecuencias

La fixture puede quedar atrás de la API. El workflow `contract.yml` compara el esquema con la API real cada día. Valkey y `cacheHandlers` quedan fuera: una instancia y el disco de `.next/cache` alcanzan para este catálogo.
