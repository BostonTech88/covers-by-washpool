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
  window.gtag?.("event", "quote_start", { product_type: productType });
}

/** Dispara cuando el sistema muestra el precio base al usuario */
export function quotePriceShown(params: {
  productType: "termica" | "seguridad";
  largo: number;
  ancho: number;
  precioBase: number;
}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "quote_price_shown", {
    product_type: params.productType,
    largo: params.largo,
    ancho: params.ancho,
    precio_base: params.precioBase,
  });
}

/**
 * trackLead — dispara generate_lead en GA4, qualify_lead en GA4,
 * Lead en Meta Pixel y conversión en Google Ads.
 * Llámalo en la pantalla de confirmación (antes de abrir WhatsApp).
 */
export function trackLead(
  productType: "termica" | "seguridad" | "general",
  source: string,
  extra?: {
    precioBase?: number;
    ciudad?: string;
    cp?: string;
  }
) {
  if (typeof window === "undefined") return;

  const params = {
    product_type: productType,
    source,
    ...(extra?.precioBase && { precio_base: extra.precioBase }),
    ...(extra?.ciudad && { ciudad: extra.ciudad }),
    ...(extra?.cp && { cp: extra.cp }),
  };

  // GA4
  window.gtag?.("event", "generate_lead", params);
  window.gtag?.("event", "qualify_lead", params);

  // Meta Pixel
  window.fbq?.("track", "Lead", {
    content_category: productType,
    content_name: source,
  });

  // Google Ads
  window.gtag_report_conversion?.();
}
