export type Money = {
  amount: number;
  currency: "USD";
};

export type ProductRating = {
  rate: number;
  count: number;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  price: Money;
  rating: ProductRating;
};
