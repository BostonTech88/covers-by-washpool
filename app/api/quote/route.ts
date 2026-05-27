import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "[OWNER_EMAIL]";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const data = await req.formData();

    const tipoCubierta  = data.get("tipo_cubierta")?.toString() ?? "";
    const nombre        = data.get("nombre")?.toString() ?? "";
    const correo        = data.get("correo")?.toString() ?? "";
    const telefono      = data.get("telefono")?.toString() ?? "";
    const whatsapp      = data.get("whatsapp")?.toString() ?? "";
    const ciudad        = data.get("ciudad")?.toString() ?? "";
    const tipo          = data.get("tipo")?.toString() ?? "";
    const tipoProyecto  = data.get("tipo_proyecto")?.toString() ?? "";
    const largo         = data.get("largo")?.toString() ?? "";
    const ancho         = data.get("ancho")?.toString() ?? "";
    const espacioAnclaje = data.get("espacioAnclaje")?.toString() ?? "";
    const espacioAnclajeNuevo = data.get("espacio_anclaje")?.toString() ?? "";
    const formaAlberca  = data.get("formaAlberca")?.toString() ?? "";
    const notas         = data.get("notas")?.toString() ?? "";
    const materialBorde = data.get("material_borde")?.toString() ?? "";
    const obstaculos = data.get("obstaculos")?.toString() ?? "";

    const isSeguridad = tipoCubierta.toLowerCase().includes("seguridad");
    const subjectPrefix = isSeguridad ? "Nueva cotización seguridad" : "Nueva cotización térmica";

    const rawFiles = data.getAll("archivos") as File[];
    const attachments: { filename: string; content: Buffer }[] = [];

    for (const file of rawFiles) {
      if (file.size > 0) {
        const bytes = await file.arrayBuffer();
        attachments.push({
          filename: file.name,
          content: Buffer.from(bytes),
        });
      }
    }

    const displayPhone = whatsapp || telefono;
    const anchorSpace = espacioAnclajeNuevo || espacioAnclaje;

    const html = isSeguridad
      ? `
<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#111827;">

  <div style="background:#1a3a5c;padding:24px 32px;">
    <p style="color:#00b4b1;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 4px;">
      Nueva solicitud de cotización
    </p>
    <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0;">
      ${nombre}
    </h1>
  </div>

  <div style="padding:32px;background:#ffffff;border:1px solid #e5e7eb;border-top:none;">

    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
      ${row("Tipo de cubierta", `<strong>Cubierta de Seguridad</strong>`)}
    </table>

    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
      ${row("Tipo de proyecto", `<strong>${tipoProyecto || tipo || "—"}</strong>`)}
    </table>

    <h2 style="font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;margin:0 0 16px;">
      Contacto
    </h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
      ${row("Nombre",   nombre)}
      ${row("WhatsApp", displayPhone)}
      ${row("Correo",   correo)}
      ${row("Ciudad",   ciudad)}
    </table>

    <h2 style="font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;margin:0 0 16px;">
      Alberca
    </h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
      ${row("Forma", formaAlberca || "—")}
      ${formaAlberca.toLowerCase().includes("rect") ? row("Largo", largo ? `${largo} m` : "—") : ""}
      ${formaAlberca.toLowerCase().includes("rect") ? row("Ancho", ancho ? `${ancho} m` : "—") : ""}
      ${
        formaAlberca.toLowerCase().includes("rect")
          ? row(
              "Área aproximada",
              largo && ancho ? `${(parseFloat(largo) * parseFloat(ancho)).toFixed(1)} m²` : "—"
            )
          : row("Documento", "Archivo adjunto")
      }
    </table>

    <h2 style="font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;margin:0 0 16px;">
      Instalación
    </h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
      ${row("Espacio de anclaje", anchorSpace || "—")}
      ${row("Material del borde", materialBorde || "—")}
      ${row("Obstáculos", obstaculos || "Ninguno")}
    </table>

    ${notas ? `
    <h2 style="font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;margin:0 0 12px;">
      Notas adicionales
    </h2>
    <p style="background:#f8f9fb;border-left:3px solid #00b4b1;padding:12px 16px;margin:0 0 32px;font-size:14px;line-height:1.6;color:#374151;">
      ${notas.replace(/\n/g, "<br>")}
    </p>` : ""}

    ${attachments.length > 0 ? `
    <p style="font-size:13px;color:#6b7280;">
      📎 ${attachments.length} archivo(s) adjunto(s): ${attachments.map((a) => a.filename).join(", ")}
    </p>` : ""}

  </div>

  <div style="padding:20px 32px;background:#f8f9fb;border:1px solid #e5e7eb;border-top:none;">
    <p style="font-size:12px;color:#9ca3af;margin:0;">
      Covers by Washpool — sistema de cotizaciones automáticas
    </p>
  </div>

</div>`
      : `
<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#111827;">

  <div style="background:#1a3a5c;padding:24px 32px;">
    <p style="color:#00b4b1;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 4px;">
      Nueva solicitud de cotización
    </p>
    <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0;">
      ${nombre}
    </h1>
  </div>

  <div style="padding:32px;background:#ffffff;border:1px solid #e5e7eb;border-top:none;">

    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
      ${row("Tipo de cubierta", `<strong>Cubierta Térmica</strong>`)}
    </table>

    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
      ${row("Tipo de proyecto", `<strong>${tipoProyecto || "—"}</strong>`)}
    </table>

    <h2 style="font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;margin:0 0 16px;">
      Contacto
    </h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
      ${row("Nombre",   nombre)}
      ${row("WhatsApp", displayPhone)}
      ${row("Correo",   correo)}
      ${row("Ciudad",   ciudad)}
    </table>

    <h2 style="font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;margin:0 0 16px;">
      Alberca
    </h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
      ${row("Forma", formaAlberca || "—")}
      ${formaAlberca.toLowerCase().includes("rect") ? row("Largo", largo ? `${largo} m` : "—") : ""}
      ${formaAlberca.toLowerCase().includes("rect") ? row("Ancho", ancho ? `${ancho} m` : "—") : ""}
      ${
        formaAlberca.toLowerCase().includes("rect")
          ? row(
              "Área aproximada",
              largo && ancho ? `${(parseFloat(largo) * parseFloat(ancho)).toFixed(1)} m²` : "—"
            )
          : row("Documento", "Archivo adjunto")
      }
    </table>

    ${attachments.length > 0 ? `
    <p style="font-size:13px;color:#6b7280;">
      📎 ${attachments.length} archivo(s) adjunto(s): ${attachments.map((a) => a.filename).join(", ")}
    </p>` : ""}

  </div>

  <div style="padding:20px 32px;background:#f8f9fb;border:1px solid #e5e7eb;border-top:none;">
    <p style="font-size:12px;color:#9ca3af;margin:0;">
      Covers by Washpool — sistema de cotizaciones automáticas
    </p>
  </div>

</div>`;

    await resend.emails.send({
      from:        "Covers by Washpool <cotizaciones@washpool.mx>",
      to:          OWNER_EMAIL,
      replyTo:     correo,
      subject:     `${subjectPrefix} — ${nombre}`,
      html,
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[quote] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

function row(label: string, value: string) {
  return `
  <tr>
    <td style="padding:8px 0;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;width:180px;vertical-align:top;border-bottom:1px solid #f3f4f6;">
      ${label}
    </td>
    <td style="padding:8px 0;font-size:14px;color:#111827;vertical-align:top;border-bottom:1px solid #f3f4f6;">
      ${value}
    </td>
  </tr>`;
}
