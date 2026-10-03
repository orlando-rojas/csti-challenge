const labels: Record<string, string> = {
  electronics: "Electrónica",
  jewelery: "Joyería",
  "men's clothing": "Ropa de hombre",
  "women's clothing": "Ropa de mujer",
};

export function categoryLabel(category: string): string {
  return labels[category] ?? category;
}
