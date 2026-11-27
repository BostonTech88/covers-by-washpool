"use client";

import { useState, type FormEvent } from "react";
import { trackWhatsAppClick } from "@/lib/analytics";
import {
  buildSecurityQuoteMessage,
  type SecurityQuote,
} from "@/lib/whatsapp-quote";

import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

const inputClass =
  "w-full border border-navy/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-navy";

export default function SecurityQuoteForm() {
  const [quote, setQuote] = useState<SecurityQuote>({
    nombre: "",
    telefono: "",
    ciudad: "",
    medidas: "",
    observaciones: "",
  });
  const [prepared, setPrepared] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const message = buildSecurityQuoteMessage(quote);

  function update(field: keyof SecurityQuote, value: string) {
    setQuote((current) => ({ ...current, [field]: value }));
    setPrepared(false);
    setCopyStatus("");
  }

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      ![quote.nombre, quote.telefono, quote.ciudad, quote.medidas].every(
        (value) => value.trim(),
      )
    )
      return;
    setPrepared(true);
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus(
        "Mensaje copiado. Pégalo y envíalo en WhatsApp; todavía no hemos recibido tu solicitud.",
      );
    } catch {
      setCopyStatus(
        "No se pudo copiar. Selecciona el mensaje de arriba y cópialo manualmente.",
      );
    }
  }

  return (
    <form onSubmit={prepare} className="flex flex-col gap-6">
      <div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight leading-tight mb-3">
          Cotiza tu cubierta de seguridad
        </h3>
        <p className="text-base leading-relaxed text-gray-700">
          Prepara tu mensaje y envíalo en WhatsApp para que podamos atenderte.
        </p>
      </div>
      <p className="text-sm font-semibold text-navy">
        Tipo de cubierta: Seguridad
      </p>
      {(
        [
          ["nombre", "Nombre", "text", "name", 100],
          ["telefono", "Teléfono / WhatsApp", "tel", "tel", 40],
          ["ciudad", "Ciudad", "text", "address-level2", 100],
        ] as const
      ).map(([field, label, type, autoComplete, maxLength]) => (
        <label key={field} className="block text-sm font-semibold text-navy">
          {label}
          <input
            className={`${inputClass} mt-2`}
            name={field}
            type={type}
            autoComplete={autoComplete}
            required
            pattern=".*\S.*"
            maxLength={maxLength}
            value={quote[field]}
            onChange={(event) => update(field, event.target.value)}
          />
        </label>
      ))}
      <label className="block text-sm font-semibold text-navy">
        Medidas de la alberca
        <textarea
          className={`${inputClass} mt-2`}
          name="medidas"
          required
          maxLength={200}
          rows={2}
          placeholder="Ej. 8 × 4 metros. Si aún no las tienes, escribe ‘por confirmar’."
          value={quote.medidas}
          onChange={(event) => update("medidas", event.target.value)}
        />
      </label>
      <label className="block text-sm font-semibold text-navy">
        Observaciones (opcional)
        <textarea
          className={`${inputClass} mt-2`}
          name="observaciones"
          maxLength={600}
          rows={3}
          placeholder="Forma de la alberca, obstáculos alrededor o detalles del proyecto."
          value={quote.observaciones}
          onChange={(event) => update("observaciones", event.target.value)}
        />
      </label>
      <p className="text-sm text-gray-600">
        Adjunta las fotografías, planos y archivos manualmente en WhatsApp
        después de abrir la conversación. Esta página no carga ni adjunta
        archivos automáticamente.
      </p>
      <button
        type="submit"
        disabled={
          ![quote.nombre, quote.telefono, quote.ciudad, quote.medidas].every(
            (value) => value.trim(),
          )
        }
        className="bg-navy text-white font-semibold text-sm tracking-widest uppercase py-4 px-8 hover:bg-teal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Preparar mensaje →
      </button>
      {prepared && (
        <div className="flex flex-col gap-4">
          <p role="status" className="text-sm text-navy">
            Mensaje preparado, aún no enviado. Revisa el texto y pulsa enviar
            dentro de WhatsApp. Abrir WhatsApp no confirma que hayamos recibido
            tu conversación.
          </p>
          <label className="block text-sm font-semibold text-navy">
            Tu mensaje
            <textarea
              readOnly
              value={message}
              rows={10}
              className={`${inputClass} mt-2`}
            />
          </label>
          <a
            href={buildWhatsAppUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("seguridad", "cta_seguridad")}
            className="bg-navy text-white font-semibold text-sm tracking-widest uppercase py-4 px-8 hover:bg-teal transition-colors text-center"
          >
            Abrir WhatsApp →
          </a>
          <button
            type="button"
            onClick={copyMessage}
            className="text-sm text-navy underline"
          >
            Copiar mensaje
          </button>
          <p className="text-sm text-gray-600">
            Si WhatsApp no abre, copia el mensaje y escríbenos al{" "}
            {WHATSAPP_DISPLAY}. Tus datos siguen aquí mientras esta página
            permanezca abierta.
          </p>
          <p role="status" className="text-sm text-gray-600">
            {copyStatus}
          </p>
        </div>
      )}
    </form>
  );
}
