import { ButtonLink } from "@/shared/ui/button";
import { StatusMessage } from "@/shared/ui/status-message";

export default function ProductNotFound() {
  return (
    <StatusMessage
      title="Ese producto no está"
      description="El identificador no corresponde a nada del catálogo."
      action={<ButtonLink href="/products">Volver al catálogo</ButtonLink>}
    />
  );
}
