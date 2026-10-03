const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "USD",
});

export function formatMoney(amount: number): string {
  return money.format(amount);
}

export function formatRating(rate: number, count: number): string {
  const rounded = rate.toLocaleString("es-PE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const reviews = count.toLocaleString("es-PE");
  return `${rounded} de 5 · ${reviews} reseñas`;
}
