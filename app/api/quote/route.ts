import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "[OWNER_EMAIL]";

const FILE_FIELD_NAMES = ["archivos", "fotos_alrededores", "files"] as const;

async function attachmentsFromFormData(formData: FormData) {
  const attachments: { filename: string; content: string }[] = [];

  for (const fieldName of FILE_FIELD_NAMES) {
    for (const entry of formData.getAll(fieldName)) {
      if (!(entry instanceof Blob) || entry.size === 0) continue;

      const bytes = await entry.arrayBuffer();
      const filename =
        entry instanceof File && entry.name.trim()
          ? entry.name
          : `${fieldName}-${attachments.length + 1}`;

      attachments.push({
        filename,
        content: Buffer.from(bytes).toString("base64"),
      });
    }
  }

  return attachments;
}

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
    const medioContacto = data.get("medio_contacto")?.toString() ?? "";
    const largo         = data.get("largo")?.toString() ?? "";
    const ancho         = data.get("ancho")?.toString() ?? "";
    const formaAlberca  = data.get("formaAlberca")?.toString() ?? "";
    const notas         = data.get("notas")?.toString() ?? "";
    const notasObstaculos = data.get("notas_obstaculos")?.toString() ?? "";

    const isSeguridad = tipoCubierta.toLowerCase().includes("seguridad");
    const subjectPrefix = isSeguridad ? "Nueva cotización seguridad" : "Nueva cotización térmica";

    const attachments = await attachmentsFromFormData(data);

    const displayPhone = whatsapp || telefono;

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
      ${row("Medio de contacto preferido", medioContacto || "—")}
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
      Alrededores
    </h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
      ${row("Notas de obstáculos", notasObstaculos.trim() ? notasObstaculos.replace(/\n/g, "<br>") : "Sin notas")}
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
      ${row("Medio de contacto preferido", medioContacto || "—")}
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
      from:        "Covers by Washpool <ventas@coversbywashpool.com>",
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
