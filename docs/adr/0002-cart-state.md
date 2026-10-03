# ADR 0002: Estado del carrito

## Contexto

El carrito no tiene backend. Hace falta que sobreviva a la recarga, no desajuste la hidratación y no re-renderice toda la página.

## Decisión

Zustand con `persist` en `localStorage` (`norte-cart`, `version: 1`). El store solo orquesta. Las transiciones viven en `cart/domain`: agregar, cambiar cantidad, quitar, migrar. `partialize` guarda `{ productId, qty, unitPrice, title, image }`. El badge reserva un ancho fijo y muestra la cantidad después de rehidratar. Un listener de `storage` rehidrata las otras pestañas. El feedback es un toast y un `aria-live`.

## Alternativa

Carrito en cookie con Server Actions y `useOptimistic`. Encaja cuando haya checkout y stock en el servidor. Hoy añadiría una ida y vuelta para un estado que solo existe en el navegador.

## Consecuencias

El carrito no se comparte entre dispositivos. El precio guardado es el de cuando se agregó el producto.
