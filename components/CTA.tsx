"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ProductType = "termica" | "seguridad";

type ThermalProjectType = "Casa" | "Hotel / Club / Condominio";
type ThermalShapeType = "Rectangular" | "Irregular";
type SecurityProjectType = "Casa" | "Hotel / Club / Condominio";
type SecurityShapeType = "Rectangular" | "Irregular";
type ContactPreference = "WhatsApp" | "Correo electrónico";
type FormState = {
  nombre: string;
  correo: string;
  telefono: string;
  ciudad: string;
  tipo: string;
  largo: string;
  ancho: string;
  espacioAnclaje: string;
  formaAlberca: string;
  notas: string;
  confirmacion: boolean;
};

const INITIAL: FormState = {
  nombre: "",
  correo: "",
  telefono: "",
  ciudad: "",
  tipo: "",
  largo: "",
  ancho: "",
  espacioAnclaje: "",
  formaAlberca: "",
  notas: "",
  confirmacion: false,
};

type ThermalState = {
  nombre: string;
  whatsapp: string;
  correo: string;
  ciudad: string;
  medioContacto: ContactPreference | "";
  tipoProyecto: ThermalProjectType | "";
  forma: ThermalShapeType | "";
  largo: string;
  ancho: string;
  archivo: File | null;
  confirmacion: boolean;
};

const THERMAL_INITIAL: ThermalState = {
  nombre: "",
  whatsapp: "",
  correo: "",
  ciudad: "",
  medioContacto: "",
  tipoProyecto: "",
  forma: "",
  largo: "",
  ancho: "",
  archivo: null,
  confirmacion: false,
};

type SecurityState = {
  nombre: string;
  whatsapp: string;
  correo: string;
  ciudad: string;
  medioContacto: ContactPreference | "";
  tipoProyecto: SecurityProjectType | "";
  forma: SecurityShapeType | "";
  largo: string;
  ancho: string;
  archivo: File | null;
  fotosAlrededores: File[];
  notasObstaculos: string;
  confirmacion: boolean;
};

const SECURITY_INITIAL: SecurityState = {
  nombre: "",
  whatsapp: "",
  correo: "",
  ciudad: "",
  medioContacto: "",
  tipoProyecto: "",
  forma: "",
  largo: "",
  ancho: "",
  archivo: null,
  fotosAlrededores: [],
  notasObstaculos: "",
  confirmacion: false,
};

function appendFilesToFormData(formData: FormData, fieldName: string, files: File[]) {
  for (const file of files) {
    if (file.size > 0) {
      formData.append(fieldName, file, file.name);
    }
  }
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label-caps text-navy/50 block mb-2" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}

function InlineError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs mt-1" style={{ color: "#dc2626" }}>
      {message}
    </p>
  );
}

function MeasurementGuide({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="text-sm text-teal hover:underline focus:outline-none"
      >
        {open ? "← Cerrar guía" : "¿Cómo mido correctamente mi alberca? →"}
      </button>

      <div
        style={{
          maxHeight: open ? "2400px" : "0",
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        <div
          className="mt-2 mb-4 pl-4 py-3 border-l-2 border-teal"
          style={{ background: "color-mix(in srgb, #1a3a5c 3%, transparent)" }}
        >
          <p className="text-xs font-semibold text-navy mb-1 uppercase tracking-widest">
            Antes de empezar
          </p>
          <p className="text-sm mb-4" style={{ color: "#374151" }}>
            Necesitas: cinta métrica de al menos 10 metros, una persona que te ayude,
            tu teléfono para tomar fotos.
          </p>

          <p className="text-sm font-semibold text-navy mb-1">
            Paso 1 — Identifica la forma de tu alberca
          </p>
          <p className="text-sm mb-1" style={{ color: "#374151" }}>
            <strong>Rectangular/cuadrada:</strong> la más fácil de medir.
          </p>
          <p className="text-sm mb-1" style={{ color: "#374151" }}>
            <strong>Con escalones integrados:</strong> los escalones cuentan como parte
            del área a cubrir.
          </p>
          <p className="text-sm mb-4" style={{ color: "#374151" }}>
            <strong>Forma irregular (L, riñón, free-form):</strong> sube un plano o
            croquis — el formulario no es suficiente para estos casos.
          </p>

          <p className="text-sm font-semibold text-navy mb-1">
            Paso 2 — Mide el LARGO
          </p>
          <p className="text-sm mb-2" style={{ color: "#374151" }}>
            De borde a borde en el punto más largo, por fuera del cuerpo de agua, a
            nivel de la orilla.
          </p>
          <div
            className="text-xs px-3 py-2 mb-4 border-l-2 border-amber-400"
            style={{ background: "#fffbeb" }}
          >
            ⚠️ Error más común: medir la superficie del agua en lugar de la orilla
            completa. La cubierta ancla en el borde, no en el agua.
          </div>

          <p className="text-sm font-semibold text-navy mb-1">
            Paso 3 — Mide el ANCHO
          </p>
          <p className="text-sm mb-2" style={{ color: "#374151" }}>
            De borde a borde en el punto más ancho, a nivel de la orilla.
          </p>
          <div
            className="text-xs px-3 py-2 mb-4 border-l-2 border-amber-400"
            style={{ background: "#fffbeb" }}
          >
            ⚠️ Si un extremo es más angosto que el otro, mide ambos y anótalo en
            &quot;Notas adicionales&quot;.
          </div>

          <p className="text-sm font-semibold text-navy mb-1">
            Paso 4 — Mide el espacio de anclaje
          </p>
          <p className="text-sm mb-1" style={{ color: "#374151" }}>
            Distancia desde el borde de la alberca hasta el primer obstáculo en cada
            lado.
          </p>
          <p className="text-sm mb-2" style={{ color: "#374151" }}>
            Mínimo necesario: 30 cm.
          </p>
          <div
            className="text-xs px-3 py-2 mb-4 border-l-2 border-amber-400"
            style={{ background: "#fffbeb" }}
          >
            ⚠️ Si tienes menos de 30 cm en algún lado, indícalo en notas — tiene
            solución pero hay que considerarlo desde el diseño.
          </div>

          <p className="text-sm font-semibold text-navy mb-1">
            Paso 5 — Documenta obstáculos
          </p>
          <p className="text-sm mb-1" style={{ color: "#374151" }}>
            Anota si existe alguno de estos alrededor:
          </p>
          <ul className="text-sm mb-4 pl-4 list-disc" style={{ color: "#374151" }}>
            <li>Escaleras externas o barandales</li>
            <li>Columnas o pilares</li>
            <li>Jardineras fijas</li>
            <li>Equipos pegados al borde (bomba, filtro)</li>
            <li>Desniveles en el piso</li>
          </ul>

          <p className="text-sm font-semibold text-navy mb-1">
            Paso 6 — Toma estas fotos y súbelas
          </p>
          <ol className="text-sm mb-4 pl-4 list-decimal" style={{ color: "#374151" }}>
            <li>Vista completa desde una esquina</li>
            <li>Vista desde arriba si es posible</li>
            <li>Foto de cada lado mostrando el espacio de anclaje</li>
            <li>Foto de cualquier obstáculo o irregularidad</li>
          </ol>

          <p className="text-sm" style={{ color: "#374151" }}>
            ¿Tienes planos arquitectónicos? Súbelos directamente — nos ahorran pasos y
            garantizan la mayor precisión.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CTA() {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [thermal, setThermal] = useState<ThermalState>(THERMAL_INITIAL);
  const [thermalErrors, setThermalErrors] = useState<Record<string, string>>({});
  const [security, setSecurity] = useState<SecurityState>(SECURITY_INITIAL);
  const [securityErrors, setSecurityErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successProduct, setSuccessProduct] = useState<ProductType | null>(null);
  const [error, setError] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const thermalFileRef = useRef<HTMLInputElement>(null);
  const securityFileRef = useRef<HTMLInputElement>(null);
  const securityPhotosRef = useRef<HTMLInputElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const scrollPendingRef = useRef(false);

  function set(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setThermalField<K extends keyof ThermalState>(field: K, value: ThermalState[K]) {
    setThermal((prev) => ({ ...prev, [field]: value }));
  }

  function setSecurityField<K extends keyof SecurityState>(field: K, value: SecurityState[K]) {
    setSecurity((prev) => ({ ...prev, [field]: value }));
  }

  function selectProduct(next: ProductType) {
    setProduct(next);
    setGuideOpen(false);
    setError("");
  }

  function scrollToForm() {
    requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  useEffect(() => {
    function applyHash() {
      const hash = window.location.hash;
      if (hash === "#cotizacion-termica") {
        scrollPendingRef.current = true;
        selectProduct("termica");
      } else if (hash === "#cotizacion-seguridad") {
        scrollPendingRef.current = true;
        selectProduct("seguridad");
      }
    }

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    if (product && scrollPendingRef.current && formVisible) {
      scrollPendingRef.current = false;
      scrollToForm();
    }
  }, [product, formVisible]);

  useEffect(() => {
    if (product) {
      setFormVisible(false);
      const id = requestAnimationFrame(() => setFormVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setFormVisible(false);
  }, [product]);

  function validateThermal(next: ThermalState) {
    const errs: Record<string, string> = {};

    if (!next.nombre.trim()) errs.nombre = "Ingresa tu nombre completo.";
    if (!next.whatsapp.trim()) errs.whatsapp = "Ingresa tu WhatsApp.";
    if (!next.correo.trim()) errs.correo = "Ingresa tu correo electrónico.";
    if (!next.ciudad.trim()) errs.ciudad = "Ingresa tu ciudad y estado.";
    if (!next.medioContacto) errs.medioContacto = "Selecciona cómo prefieres recibir tu cotización.";
    if (!next.tipoProyecto) errs.tipoProyecto = "Selecciona el tipo de proyecto.";
    if (!next.forma) errs.forma = "Selecciona la forma de tu alberca.";

    if (next.forma === "Rectangular") {
      if (!next.largo.trim()) errs.largo = "Ingresa el largo.";
      if (!next.ancho.trim()) errs.ancho = "Ingresa el ancho.";
    }
    if (next.forma === "Irregular") {
      if (!next.archivo) errs.archivo = "Necesitamos un plano o croquis para cotizar esta forma de alberca.";
    }

    if (!next.confirmacion) errs.confirmacion = "Debes aceptar la confirmación.";
    return errs;
  }

  async function handleSubmitThermal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const errs = validateThermal(thermal);
    setThermalErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.set("tipo_cubierta", "Térmica");
      data.set("tipo_proyecto", thermal.tipoProyecto);
      data.set("nombre", thermal.nombre);
      data.set("whatsapp", thermal.whatsapp);
      data.set("correo", thermal.correo);
      data.set("ciudad", thermal.ciudad);
      data.set("medio_contacto", thermal.medioContacto);
      data.set("formaAlberca", thermal.forma === "Rectangular" ? "Rectangular" : "Irregular");
      if (thermal.forma === "Rectangular") {
        data.set("largo", thermal.largo);
        data.set("ancho", thermal.ancho);
      }
      if (thermal.archivo) {
        appendFilesToFormData(data, "archivos", [thermal.archivo]);
      }
      data.set("confirmacion", thermal.confirmacion ? "on" : "");

      const res = await fetch("/api/quote", { method: "POST", body: data });
      if (!res.ok) throw new Error("server");
      setSuccessProduct("termica");
    } catch {
      setError("Ocurrió un error al enviar. Intenta de nuevo o escríbenos por WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  function validateSecurity(next: SecurityState) {
    const errs: Record<string, string> = {};

    if (!next.nombre.trim()) errs.nombre = "Ingresa tu nombre completo.";
    if (!next.whatsapp.trim()) errs.whatsapp = "Ingresa tu WhatsApp.";
    if (!next.correo.trim()) errs.correo = "Ingresa tu correo electrónico.";
    if (!next.ciudad.trim()) errs.ciudad = "Ingresa tu ciudad y estado.";
    if (!next.medioContacto) errs.medioContacto = "Selecciona cómo prefieres recibir tu cotización.";
    if (!next.tipoProyecto) errs.tipoProyecto = "Selecciona el tipo de proyecto.";
    if (!next.forma) errs.forma = "Selecciona la forma de tu alberca.";

    if (next.forma === "Rectangular") {
      if (!next.largo.trim()) errs.largo = "Ingresa el largo.";
      if (!next.ancho.trim()) errs.ancho = "Ingresa el ancho.";
    }
    if (next.forma === "Irregular") {
      if (!next.archivo) errs.archivo = "Necesitamos un plano o croquis para cotizar esta forma de alberca.";
    }

    if (!next.confirmacion) errs.confirmacion = "Debes aceptar la confirmación.";

    return errs;
  }

  async function handleSubmitSecurityNew(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const errs = validateSecurity(security);
    setSecurityErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.set("tipo_cubierta", "Seguridad");
      data.set("tipo_proyecto", security.tipoProyecto);
      data.set("nombre", security.nombre);
      data.set("whatsapp", security.whatsapp);
      data.set("correo", security.correo);
      data.set("ciudad", security.ciudad);
      data.set("medio_contacto", security.medioContacto);
      data.set("formaAlberca", security.forma === "Rectangular" ? "Rectangular" : "Irregular");
      if (security.forma === "Rectangular") {
        data.set("largo", security.largo);
        data.set("ancho", security.ancho);
      }
      if (security.archivo) {
        appendFilesToFormData(data, "archivos", [security.archivo]);
      }
      appendFilesToFormData(data, "fotos_alrededores", security.fotosAlrededores);
      data.set("notas_obstaculos", security.notasObstaculos.trim());
      data.set("confirmacion", security.confirmacion ? "on" : "");

      const res = await fetch("/api/quote", { method: "POST", body: data });
      if (!res.ok) throw new Error("server");
      setSuccessProduct("seguridad");
    } catch {
      setError("Ocurrió un error al enviar. Intenta de nuevo o escríbenos por WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "field-base w-full";
  const selectCls = "field-base field-select w-full cursor-pointer";

  const trustSignals =
    product === "seguridad"
      ? [
          "— Cotización sin costo ni compromiso",
          "— Anticipo del 50% al confirmar",
          "— Entrega en 10 a 12 semanas",
          "— Garantía de fabrica de 15 años",
        ]
      : [
          "— Cotización sin costo ni compromiso",
          "— Anticipo del 50% al confirmar",
          "— Entrega en 7 a 20 días según producto",
          "— Garantía de fabrica de 1 año",
        ];

  return (
    <section id="cotizacion" className="bg-offwhite border-b border-navy/10 py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Step 1 — Product selector */}
        <div className="mb-16">
          <span className="label-caps text-teal block mb-5">
            Cotización sin costo
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight leading-[1.05] mb-10">
            ¿Qué tipo de cubierta necesitas?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              type="button"
              onClick={() => selectProduct("termica")}
              className={`text-left p-6 cursor-pointer transition-colors ${
                product === "termica"
                  ? "border-2 border-navy bg-navy/5"
                  : "border border-navy/20 bg-white"
              }`}
            >
              <h3 className="font-extrabold text-navy text-lg tracking-tight mb-2">
                Cubierta Térmica
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                Para conservar limpieza, calor, reducir evaporación y ahorrar en químicos.
              </p>
            </button>

            <button
              type="button"
              onClick={() => selectProduct("seguridad")}
              className={`text-left p-6 cursor-pointer transition-colors ${
                product === "seguridad"
                  ? "border-2 border-navy bg-navy/5"
                  : "border border-navy/20 bg-white"
              }`}
            >
              <h3 className="font-extrabold text-navy text-lg tracking-tight mb-2">
                Cubierta de Seguridad
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                Para proteger la alberca y prevenir accidentes.
              </p>
            </button>
          </div>
        </div>

        {/* Step 2 — Form */}
        {product && (
          <div
            ref={formSectionRef}
            className={`grid md:grid-cols-[45fr_55fr] gap-12 md:gap-20 items-start transition-all duration-300 ease-out ${
              formVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight leading-[1.05] mb-6">
                Cuéntanos de tu alberca.
              </h2>
              <p className="text-base md:text-lg leading-relaxed max-w-sm" style={{ color: "#374151" }}>
                Responderemos en menos de 24 horas.
              </p>

              <div className="mt-10 flex flex-col gap-3 border-t border-navy/10 pt-8">
                {trustSignals.map((signal) => (
                  <p
                    key={signal}
                    className="text-sm leading-relaxed"
                    style={{ color: "#6b7280" }}
                  >
                    {signal}
                  </p>
                ))}
              </div>

              <div
                className="border-l-2 border-teal pl-4 py-2 mt-6"
                style={{ background: "color-mix(in srgb, #1a3a5c 3%, transparent)" }}
              >
                <p className="text-sm font-semibold text-navy mb-2">
                  ¿Cómo medir tu alberca?
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  Mide de pared a pared en el punto más largo y en el punto más ancho. Por debajo de la nariz de la alberca.
                  <br />
                  <br />
                  Para albercas rectangulares o cuadradas necesitas dos medidas: largo y ancho.
                  <br />
                  <br />
                  Para albercas irregulares necesitas un plano, croquis o foto con medidas anotadas.
                  Sin este documento no podemos cotizar.
                </p>
              </div>

              {product === "termica" && (
                <div className="relative w-full h-[240px] mt-6">
                  <Image
                    src="/hero-2.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover object-center"
                  />
                </div>
              )}

              {product === "seguridad" && (
                <div className="mt-6 flex flex-col gap-0">
                  <div className="relative w-full h-[180px]">
                    <Image
                      src="/seguridad-1.jpg"
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="relative w-full h-[180px]">
                    <Image
                      src="/seguridad-2.jpg"
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="relative w-full h-[180px]">
                    <Image
                      src="/seguridad-3.jpg"
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border-l border-navy/10 pl-10 md:pl-12">
              {successProduct === product ? (
                <div className="border-l-2 border-teal pl-6 py-2">
                  <p className="font-extrabold text-navy text-lg tracking-tight mb-2">
                    ¡Listo! Nos pondremos en contacto contigo en menos de 24 horas con tu cotización.
                  </p>
                </div>
              ) : (
                product === "termica" ? (
                  <form className="flex flex-col gap-6" onSubmit={handleSubmitThermal}>
                    {/* STEP 1 — CONTACTO */}
                    <div className="pt-1 border-t border-navy/[0.08]">
                      <p className="label-caps text-teal mb-4">Tus datos</p>

                      <Field id="t-nombre" label="Nombre completo">
                        <input
                          id="t-nombre"
                          name="nombre"
                          type="text"
                          autoComplete="name"
                          placeholder="Tu nombre"
                          value={thermal.nombre}
                          onChange={(e) => setThermalField("nombre", e.target.value)}
                          className={inputCls}
                        />
                        <InlineError message={thermalErrors.nombre} />
                      </Field>

                      <Field id="t-whatsapp" label="WhatsApp">
                        <input
                          id="t-whatsapp"
                          name="whatsapp"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+52 55 0000 0000"
                          value={thermal.whatsapp}
                          onChange={(e) => setThermalField("whatsapp", e.target.value)}
                          className={inputCls}
                        />
                        <InlineError message={thermalErrors.whatsapp} />
                      </Field>

                      <Field id="t-correo" label="Correo electrónico">
                        <input
                          id="t-correo"
                          name="correo"
                          type="email"
                          autoComplete="email"
                          placeholder="tu@correo.com"
                          value={thermal.correo}
                          onChange={(e) => setThermalField("correo", e.target.value)}
                          className={inputCls}
                        />
                        <InlineError message={thermalErrors.correo} />
                      </Field>

                      <Field id="t-ciudad" label="Ciudad / Estado">
                        <input
                          id="t-ciudad"
                          name="ciudad"
                          type="text"
                          autoComplete="address-level2"
                          placeholder="Querétaro, Qro."
                          value={thermal.ciudad}
                          onChange={(e) => setThermalField("ciudad", e.target.value)}
                          className={inputCls}
                        />
                        <InlineError message={thermalErrors.ciudad} />
                      </Field>
                    </div>

                    <div className="pt-1 border-t border-navy/[0.08]">
                      <p className="label-caps text-teal mb-4">¿Cómo prefieres recibir tu cotización?</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setThermalField("medioContacto", "WhatsApp")}
                          className={`text-left p-4 cursor-pointer transition-colors ${
                            thermal.medioContacto === "WhatsApp"
                              ? "border-2 border-navy bg-navy/5"
                              : "border border-navy/20 bg-white"
                          }`}
                        >
                          WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={() => setThermalField("medioContacto", "Correo electrónico")}
                          className={`text-left p-4 cursor-pointer transition-colors ${
                            thermal.medioContacto === "Correo electrónico"
                              ? "border-2 border-navy bg-navy/5"
                              : "border border-navy/20 bg-white"
                          }`}
                        >
                          Correo electrónico
                        </button>
                      </div>
                      <InlineError message={thermalErrors.medioContacto} />
                    </div>

                    {/* STEP 2 — TIPO DE PROYECTO */}
                    <div className="pt-1 border-t border-navy/[0.08]">
                      <p className="label-caps text-teal mb-4">Tipo de proyecto</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setThermalField("tipoProyecto", "Casa")}
                          className={`text-left p-4 cursor-pointer transition-colors ${
                            thermal.tipoProyecto === "Casa"
                              ? "border-2 border-navy bg-navy/5"
                              : "border border-navy/20 bg-white"
                          }`}
                        >
                          Casa
                        </button>
                        <button
                          type="button"
                          onClick={() => setThermalField("tipoProyecto", "Hotel / Club / Condominio")}
                          className={`text-left p-4 cursor-pointer transition-colors ${
                            thermal.tipoProyecto === "Hotel / Club / Condominio"
                              ? "border-2 border-navy bg-navy/5"
                              : "border border-navy/20 bg-white"
                          }`}
                        >
                          Hotel / Club / Condominio
                        </button>
                      </div>
                      <InlineError message={thermalErrors.tipoProyecto} />
                    </div>

                    {/* STEP 3 — FORMA */}
                    <div className="pt-1 border-t border-navy/[0.08]">
                      <p className="label-caps text-teal mb-4">Forma de tu alberca</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setThermalField("forma", "Rectangular");
                            setThermalField("archivo", null);
                            if (thermalFileRef.current) thermalFileRef.current.value = "";
                          }}
                          className={`text-left p-4 cursor-pointer transition-colors ${
                            thermal.forma === "Rectangular"
                              ? "border-2 border-navy bg-navy/5"
                              : "border border-navy/20 bg-white"
                          }`}
                        >
                          <div className="font-semibold text-navy">Rectangular o cuadrada</div>
                          <div className="text-sm" style={{ color: "#6b7280" }}>
                            Ingresaré largo y ancho
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setThermalField("forma", "Irregular");
                            setThermalField("largo", "");
                            setThermalField("ancho", "");
                          }}
                          className={`text-left p-4 cursor-pointer transition-colors ${
                            thermal.forma === "Irregular"
                              ? "border-2 border-navy bg-navy/5"
                              : "border border-navy/20 bg-white"
                          }`}
                        >
                          <div className="font-semibold text-navy">Irregular, redonda o con curvas</div>
                          <div className="text-sm" style={{ color: "#6b7280" }}>
                            Subiré plano o croquis
                          </div>
                        </button>
                      </div>
                      <InlineError message={thermalErrors.forma} />

                      {thermal.forma === "Rectangular" && (
                        <div className="mt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <Field id="t-largo" label="Largo (m)">
                              <input
                                id="t-largo"
                                name="largo"
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="ej. 8.5"
                                value={thermal.largo}
                                onChange={(e) => setThermalField("largo", e.target.value)}
                                className={inputCls}
                              />
                              <InlineError message={thermalErrors.largo} />
                            </Field>
                            <Field id="t-ancho" label="Ancho (m)">
                              <input
                                id="t-ancho"
                                name="ancho"
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="ej. 4.0"
                                value={thermal.ancho}
                                onChange={(e) => setThermalField("ancho", e.target.value)}
                                className={inputCls}
                              />
                              <InlineError message={thermalErrors.ancho} />
                            </Field>
                          </div>
                          <p className="text-xs mt-2" style={{ color: "#6b7280" }}>
                            Mide de pared a pared, no de la superficie del agua.
                          </p>
                        </div>
                      )}

                      {thermal.forma === "Irregular" && (
                        <div className="mt-6">
                          <p className="label-caps text-navy/50 block mb-2">
                            Plano, croquis o foto con medidas
                          </p>
                          <label
                            className="border border-dashed border-navy/30 p-6 cursor-pointer text-center block"
                            style={{ background: "color-mix(in srgb, #1a3a5c 3%, transparent)" }}
                          >
                            {thermal.archivo ? (
                              <span className="text-sm text-navy font-medium">
                                {thermal.archivo.name}
                              </span>
                            ) : (
                              <>
                                <span className="text-sm font-medium" style={{ color: "#374151" }}>
                                  Haz clic para subir tu archivo
                                </span>
                                <span className="block text-xs mt-2" style={{ color: "#6b7280" }}>
                                  JPG, PNG o PDF — Obligatorio para formas irregulares
                                </span>
                              </>
                            )}
                            <input
                              ref={thermalFileRef}
                              type="file"
                              accept="image/*,.pdf"
                              multiple={false}
                              className="sr-only"
                              onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                setThermalField("archivo", file);
                              }}
                            />
                          </label>
                          <InlineError message={thermalErrors.archivo} />
                        </div>
                      )}
                    </div>

                    {/* STEP 4 — CONFIRMACIÓN */}
                    <div className="pt-1 border-t border-navy/[0.08]">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={thermal.confirmacion}
                          onChange={(e) => setThermalField("confirmacion", e.target.checked)}
                          className="checkbox-navy mt-0.5"
                        />
                        <span className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                          Confirmo que las medidas proporcionadas son correctas y entiendo que Covers
                          by Washpool no se hace responsable por errores en la fabricación derivados
                          de medidas incorrectas ingresadas por el cliente.
                        </span>
                      </label>
                      <InlineError message={thermalErrors.confirmacion} />
                    </div>

                    {error && (
                      <p className="text-sm" style={{ color: "#dc2626" }}>
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !thermal.confirmacion}
                      className="w-full bg-navy text-white font-semibold text-sm tracking-widest uppercase py-4 hover:bg-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                    >
                      {loading ? "Enviando…" : "Enviar solicitud de cubierta térmica →"}
                    </button>
                  </form>
                ) : (
                  <form className="flex flex-col gap-6" onSubmit={handleSubmitSecurityNew}>
                    {/* STEP 1 — CONTACTO */}
                    <div className="pt-1 border-t border-navy/[0.08]">
                      <p className="label-caps text-teal mb-4">Tus datos</p>

                      <Field id="s-nombre" label="Nombre completo">
                        <input
                          id="s-nombre"
                          type="text"
                          autoComplete="name"
                          placeholder="Tu nombre"
                          value={security.nombre}
                          onChange={(e) => setSecurityField("nombre", e.target.value)}
                          className={inputCls}
                        />
                        <InlineError message={securityErrors.nombre} />
                      </Field>

                      <Field id="s-whatsapp" label="WhatsApp">
                        <input
                          id="s-whatsapp"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+52 55 0000 0000"
                          value={security.whatsapp}
                          onChange={(e) => setSecurityField("whatsapp", e.target.value)}
                          className={inputCls}
                        />
                        <InlineError message={securityErrors.whatsapp} />
                      </Field>

                      <Field id="s-correo" label="Correo electrónico">
                        <input
                          id="s-correo"
                          type="email"
                          autoComplete="email"
                          placeholder="tu@correo.com"
                          value={security.correo}
                          onChange={(e) => setSecurityField("correo", e.target.value)}
                          className={inputCls}
                        />
                        <InlineError message={securityErrors.correo} />
                      </Field>

                      <Field id="s-ciudad" label="Ciudad / Estado">
                        <input
                          id="s-ciudad"
                          type="text"
                          autoComplete="address-level2"
                          placeholder="Querétaro, Qro."
                          value={security.ciudad}
                          onChange={(e) => setSecurityField("ciudad", e.target.value)}
                          className={inputCls}
                        />
                        <InlineError message={securityErrors.ciudad} />
                      </Field>
                    </div>

                    <div className="pt-1 border-t border-navy/[0.08]">
                      <p className="label-caps text-teal mb-4">¿Cómo prefieres recibir tu cotización?</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setSecurityField("medioContacto", "WhatsApp")}
                          className={`text-left p-4 cursor-pointer transition-colors ${
                            security.medioContacto === "WhatsApp"
                              ? "border-2 border-navy bg-navy/5"
                              : "border border-navy/20 bg-white"
                          }`}
                        >
                          WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={() => setSecurityField("medioContacto", "Correo electrónico")}
                          className={`text-left p-4 cursor-pointer transition-colors ${
                            security.medioContacto === "Correo electrónico"
                              ? "border-2 border-navy bg-navy/5"
                              : "border border-navy/20 bg-white"
                          }`}
                        >
                          Correo electrónico
                        </button>
                      </div>
                      <InlineError message={securityErrors.medioContacto} />
                    </div>

                    {/* STEP 2 — TIPO DE PROYECTO */}
                    <div className="pt-1 border-t border-navy/[0.08]">
                      <p className="label-caps text-teal mb-4">Tipo de proyecto</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setSecurityField("tipoProyecto", "Casa")}
                          className={`text-left p-4 cursor-pointer transition-colors ${
                            security.tipoProyecto === "Casa"
                              ? "border-2 border-navy bg-navy/5"
                              : "border border-navy/20 bg-white"
                          }`}
                        >
                          Casa
                        </button>
                        <button
                          type="button"
                          onClick={() => setSecurityField("tipoProyecto", "Hotel / Club / Condominio")}
                          className={`text-left p-4 cursor-pointer transition-colors ${
                            security.tipoProyecto === "Hotel / Club / Condominio"
                              ? "border-2 border-navy bg-navy/5"
                              : "border border-navy/20 bg-white"
                          }`}
                        >
                          Hotel / Club / Condominio
                        </button>
                      </div>
                      <InlineError message={securityErrors.tipoProyecto} />
                    </div>

                    {/* STEP 3 — FORMA */}
                    <div className="pt-1 border-t border-navy/[0.08]">
                      <p className="label-caps text-teal mb-4">Forma de tu alberca</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSecurityField("forma", "Rectangular");
                            setSecurityField("archivo", null);
                            if (securityFileRef.current) securityFileRef.current.value = "";
                          }}
                          className={`text-left p-4 cursor-pointer transition-colors ${
                            security.forma === "Rectangular"
                              ? "border-2 border-navy bg-navy/5"
                              : "border border-navy/20 bg-white"
                          }`}
                        >
                          <div className="font-semibold text-navy">Rectangular o cuadrada</div>
                          <div className="text-sm" style={{ color: "#6b7280" }}>
                            Ingresaré largo y ancho
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSecurityField("forma", "Irregular");
                            setSecurityField("largo", "");
                            setSecurityField("ancho", "");
                          }}
                          className={`text-left p-4 cursor-pointer transition-colors ${
                            security.forma === "Irregular"
                              ? "border-2 border-navy bg-navy/5"
                              : "border border-navy/20 bg-white"
                          }`}
                        >
                          <div className="font-semibold text-navy">Irregular, redonda o con curvas</div>
                          <div className="text-sm" style={{ color: "#6b7280" }}>
                            Subiré plano o croquis
                          </div>
                        </button>
                      </div>
                      <InlineError message={securityErrors.forma} />

                      {security.forma === "Rectangular" && (
                        <div className="mt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <Field id="s-largo" label="Largo (m)">
                              <input
                                id="s-largo"
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="ej. 8.5"
                                value={security.largo}
                                onChange={(e) => setSecurityField("largo", e.target.value)}
                                className={inputCls}
                              />
                              <InlineError message={securityErrors.largo} />
                            </Field>
                            <Field id="s-ancho" label="Ancho (m)">
                              <input
                                id="s-ancho"
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="ej. 4.0"
                                value={security.ancho}
                                onChange={(e) => setSecurityField("ancho", e.target.value)}
                                className={inputCls}
                              />
                              <InlineError message={securityErrors.ancho} />
                            </Field>
                          </div>
                          <p className="text-xs mt-2" style={{ color: "#6b7280" }}>
                            Mide de pared a pared, no de la superficie del agua.
                          </p>
                        </div>
                      )}

                      {security.forma === "Irregular" && (
                        <div className="mt-6">
                          <p className="label-caps text-navy/50 block mb-2">
                            Plano, croquis o foto con medidas
                          </p>
                          <label
                            className="border border-dashed border-navy/30 p-6 cursor-pointer text-center block"
                            style={{ background: "color-mix(in srgb, #1a3a5c 3%, transparent)" }}
                          >
                            {security.archivo ? (
                              <span className="text-sm text-navy font-medium">
                                {security.archivo.name}
                              </span>
                            ) : (
                              <>
                                <span className="text-sm font-medium" style={{ color: "#374151" }}>
                                  Haz clic para subir tu archivo
                                </span>
                                <span className="block text-xs mt-2" style={{ color: "#6b7280" }}>
                                  JPG, PNG o PDF — Obligatorio para formas irregulares
                                </span>
                              </>
                            )}
                            <input
                              ref={securityFileRef}
                              type="file"
                              accept="image/*,.pdf"
                              multiple={false}
                              className="sr-only"
                              onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                setSecurityField("archivo", file);
                              }}
                            />
                          </label>
                          <InlineError message={securityErrors.archivo} />
                        </div>
                      )}
                    </div>

                    {/* Aviso de anclaje */}
                    <div className="pt-1 border-t border-navy/[0.08]">
                      <div className="border-l-2 border-amber-400 bg-amber-50 px-4 py-3">
                        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                          ⚠️ Importante: Se requieren mínimo 30 cm de espacio libre alrededor del
                          perímetro de la alberca para instalar el sistema de anclaje.
                        </p>
                      </div>
                    </div>

                    {/* Fotos y notas de alrededores */}
                    <div className="pt-1 border-t border-navy/[0.08]">
                      <p className="label-caps text-teal mb-2">Fotos de los alrededores</p>
                      <p className="text-xs mb-4" style={{ color: "#6b7280" }}>
                        Sube fotos de los obstáculos, desniveles o cualquier detalle relevante alrededor
                        de tu alberca.
                      </p>
                      <label
                        className="border border-dashed border-navy/30 p-6 cursor-pointer text-center block"
                        style={{ background: "color-mix(in srgb, #1a3a5c 3%, transparent)" }}
                      >
                        {security.fotosAlrededores.length > 0 ? (
                          <span className="text-sm text-navy font-medium text-center">
                            {security.fotosAlrededores.map((f) => f.name).join(", ")}
                          </span>
                        ) : (
                          <>
                            <span className="text-sm font-medium" style={{ color: "#374151" }}>
                              Haz clic para subir fotos
                            </span>
                            <span className="block text-xs mt-2" style={{ color: "#6b7280" }}>
                              JPG o PNG — múltiples archivos permitidos
                            </span>
                          </>
                        )}
                        <input
                          ref={securityPhotosRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={(e) => {
                            const files = Array.from(e.target.files ?? []);
                            setSecurityField("fotosAlrededores", files);
                          }}
                        />
                      </label>

                      <div className="mt-6">
                        <label className="label-caps text-teal block mb-2" htmlFor="s-notas-obstaculos">
                          Notas de obstáculos
                        </label>
                        <textarea
                          id="s-notas-obstaculos"
                          rows={3}
                          placeholder="Describe escaleras, columnas, jardineras, equipos pegados al borde, desniveles o cualquier detalle que debamos considerar."
                          value={security.notasObstaculos}
                          onChange={(e) => setSecurityField("notasObstaculos", e.target.value)}
                          className="field-base w-full resize-none"
                        />
                      </div>
                    </div>

                    {/* CONFIRMACIÓN */}
                    <div className="pt-1 border-t border-navy/[0.08]">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.confirmacion}
                          onChange={(e) => setSecurityField("confirmacion", e.target.checked)}
                          className="checkbox-navy mt-0.5"
                        />
                        <span className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                          Confirmo que las medidas proporcionadas son correctas y entiendo que Covers
                          by Washpool no se hace responsable por errores en la fabricación derivados
                          de medidas incorrectas ingresadas por el cliente.
                        </span>
                      </label>
                      <InlineError message={securityErrors.confirmacion} />
                    </div>

                    {error && (
                      <p className="text-sm" style={{ color: "#dc2626" }}>
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !security.confirmacion}
                      className="w-full bg-navy text-white font-semibold text-sm tracking-widest uppercase py-4 hover:bg-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                    >
                      {loading ? "Enviando…" : "Enviar solicitud de cubierta de seguridad →"}
                    </button>
                  </form>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
