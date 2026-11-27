"use client";
import type { ReactNode } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";

export default function WhatsAppLink({
  children,
  message = "Hola, me interesa una cubierta térmica a medida para mi alberca.",
  source,
  className = "button button-secondary",
  product = "termica",
}: {
  children: ReactNode;
  message?: string;
  source: string;
  className?: string;
  product?: "termica" | "seguridad" | "general";
}) {
  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackWhatsAppClick(product, source)}
    >
      {children}
    </a>
  );
}
