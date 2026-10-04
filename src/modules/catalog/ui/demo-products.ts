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
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
    price: { amount: 22.3, currency: "USD" },
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: "Chaqueta de algodón",
    description: "Capa ligera para cuando la tarde baja de temperatura.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
    price: { amount: 55.99, currency: "USD" },
    rating: { rate: 4.7, count: 500 },
  },
  {
    id: 4,
    title: "Camisa de corte slim",
    description: "Camisa informal, cuello abierto y manga larga.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png",
    price: { amount: 15.99, currency: "USD" },
    rating: { rate: 2.1, count: 430 },
  },
] as const satisfies readonly Product[];

export const demoProduct = demoProducts[0];
