export type Shape = "rectangular" | "circular" | "l-shape" | "irregular";
export const PRICE_PER_M2 = 121;
export const shapes: { id: Shape; label: string; icon: string }[] = [
  { id: "rectangular", label: "Rectangular", icon: "▭" },
  { id: "circular", label: "Circular", icon: "◯" },
  { id: "l-shape", label: "Forma de L", icon: "⌐" },
  { id: "irregular", label: "Irregular", icon: "〰" },
];

export function calcArea(
  shape: Shape,
  dims: Record<string, string>,
): number | null {
  const positive = (key: string) => {
    const value = Number(dims[key]);
    return Number.isFinite(value) && value > 0 ? value : null;
  };
  let area: number | null = null;
  if (shape === "rectangular") {
    const l = positive("largo"),
      a = positive("ancho");
    if (l !== null && a !== null) area = l * a;
  } else if (shape === "circular") {
    const d = positive("diametro");
    if (d !== null) area = Math.PI * Math.pow(d / 2, 2);
  } else if (shape === "l-shape") {
    const l1 = positive("largo1"),
      a1 = positive("ancho1"),
      l2 = positive("largo2"),
      a2 = positive("ancho2");
    if (l1 !== null && a1 !== null && l2 !== null && a2 !== null)
      area = l1 * a1 + l2 * a2;
  }
  return area !== null && Number.isFinite(area * PRICE_PER_M2) ? area : null;
}

export function buildThermalMessage(
  shape: Shape,
  dims: Record<string, string>,
  area: number | null,
): string {
  const medidas =
    shape === "rectangular"
      ? `${dims.largo}m × ${dims.ancho}m`
      : shape === "circular"
        ? `Diámetro ${dims.diametro}m`
        : shape === "l-shape"
          ? `Sección 1: ${dims.largo1}m × ${dims.ancho1}m / Sección 2: ${dims.largo2}m × ${dims.ancho2}m`
          : "Adjuntaré las medidas manualmente en WhatsApp";
  return [
    "Hola, me interesa cotizar una cubierta térmica a medida.",
    `Forma: ${shapes.find((item) => item.id === shape)?.label}`,
    `Medidas: ${medidas}`,
    `Precio base estimado: ${area === null ? "Por cotizar" : `$${Math.round(area * PRICE_PER_M2).toLocaleString("es-MX")} MXN`}`,
    "¿Me ayudan a confirmar los detalles y el precio final con envío?",
  ].join("\n");
}
