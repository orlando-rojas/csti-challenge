# ADR 0003: Estado de catálogo en la URL

## Contexto

Filtro, búsqueda y orden tienen que sobrevivir a la recarga y ser enlazables. La API de FakeStore no filtra.

## Decisión

nuqs define los parsers una vez. En el servidor, `createSearchParamsCache` lee `searchParams` dentro de `Suspense`. Un valor de `sort` inválido vuelve al default `rating`. La búsqueda en el cliente usa `useQueryState` con `shallow: false`, debounce de 300 ms y `useTransition`.

Las categorías son `<Link>` renderizados en el servidor, no un control de cliente. Así el crawler sigue los filtros y la página funciona sin JavaScript. Buscar y ordenar sí son islas, porque necesitan debounce y un `<select>`.

## Consecuencias

El canonical de la PLP solo conserva `category`. Una URL con `q` lleva `noindex, follow`.
