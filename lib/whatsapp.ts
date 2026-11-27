// Public contact number in international digits, without + or spaces.
// Change only this value when the WhatsApp connected to VisitoAI is ready.
export const WHATSAPP_NUMBER = "525548919773";
export const WHATSAPP_DISPLAY = `+${WHATSAPP_NUMBER}`;

export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
