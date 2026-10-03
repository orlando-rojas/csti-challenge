import "server-only";

import { env } from "@/shared/config/env";

export const site = {
  name: "Norte",
  url: env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ""),
  description:
    "Tienda de electrónica, joyería y ropa. Objetos bien elegidos, sin ruido.",
  indexable: env.SITE_INDEXABLE === "true",
};
