import type { Product } from "@/modules/catalog/domain/product";

export const demoProducts = [
  {
    id: 1,
    title: "Mochila para el día a día",
    description: "Una mochila sobria para cargar poco y bien.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    price: { amount: 109.95, currency: "USD" },
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: "Camiseta de corte recto",
    description: "Algodón liso, cuello redondo y una talla que no aprieta.",
    category: "men's clothing",
    image:
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    price: { amount: 22.3, currency: "USD" },
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: "Chaqueta de algodón",
    description: "Capa ligera para cuando la tarde baja de temperatura.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    price: { amount: 55.99, currency: "USD" },
    rating: { rate: 4.7, count: 500 },
  },
  {
    id: 4,
    title: "Pulsera de acero",
    description: "Pieza pequeña, cierre firme y poco brillo.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    price: { amount: 10.99, currency: "USD" },
    rating: { rate: 3.2, count: 89 },
  },
] as const satisfies readonly Product[];

export const demoProduct = demoProducts[0];
