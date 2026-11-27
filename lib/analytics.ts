declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    gtag_report_conversion?: () => void;
  }
}

/** Dispara cuando el usuario interactúa por primera vez con la calculadora */
export function quoteStart(productType: "termica" | "seguridad") {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", "quote_start", { product_type: productType });
  } catch {
    /* Keep calculator usable. */
  }
}

/** Dispara cuando el sistema muestra el precio base al usuario */
export function quotePriceShown(params: {
  productType: "termica" | "seguridad";
  largo: number;
  ancho: number;
  precioBase: number;
}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", "quote_price_shown", {
      product_type: params.productType,
      largo: params.largo,
      ancho: params.ancho,
      precio_base: params.precioBase,
    });
  } catch {
    /* Keep calculator usable. */
  }
}

/** A click is intent only, never proof that a WhatsApp conversation was received. */
export function trackWhatsAppClick(
  productType: "termica" | "seguridad" | "general",
  source: string,
) {
  if (typeof window === "undefined") return;
  // Analytics failures must not interrupt the contact flow. No form data is sent.
  try {
    window.gtag?.("event", "whatsapp_click", {
      product_type: productType,
      source,
    });
  } catch {
    /* The link still works. */
  }
  try {
    window.fbq?.("trackCustom", "WhatsAppClick", {
      content_category: productType,
      content_name: source,
    });
  } catch {
    /* The link still works. */
  }
}
