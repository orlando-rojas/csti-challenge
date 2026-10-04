import { ButtonLink } from "@/shared/ui/button";
import { StatusMessage } from "@/shared/ui/status-message";

export default function NotFound() {
  return (
    <StatusMessage
      className="py-24"
      title="Esa página no está"
      description="El enlace no lleva a ninguna parte de la tienda."
      action={<ButtonLink href="/">Volver al inicio</ButtonLink>}
    />
  );
}
