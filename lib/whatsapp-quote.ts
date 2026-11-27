export type SecurityQuote = {
  nombre: string;
  telefono: string;
  ciudad: string;
  medidas: string;
  observaciones: string;
};

export function buildSecurityQuoteMessage(quote: SecurityQuote): string {
  return [
    "Hola, me interesa cotizar una cubierta de seguridad.",
    "",
    "Tipo de cubierta: Seguridad",
    `Nombre: ${quote.nombre.trim()}`,
    `Teléfono: ${quote.telefono.trim()}`,
    `Ciudad: ${quote.ciudad.trim()}`,
    `Medidas de la alberca: ${quote.medidas.trim()}`,
    `Observaciones: ${quote.observaciones.trim() || "Sin observaciones"}`,
    "",
    "Las fotos, planos o archivos los adjuntaré manualmente en WhatsApp.",
    "¿Me pueden ayudar con la cotización y el envío?",
  ].join("\n");
}
