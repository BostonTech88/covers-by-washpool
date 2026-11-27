# Cotizaciones y consultas exclusivamente por WhatsApp

## Auditoría y alcance

Base revisada: origin/main 46bb057. La única integración de correo estaba en
app/api/quote/route.ts. Ningún componente ni formulario de esa versión llamaba
al endpoint: CTA, Calculator y el botón flotante ya enlazaban a WhatsApp; Specs
navegaba a las secciones de cotización. Footer también ofrecía un enlace mailto.
Se eliminan la API de correo, el SDK y sus dependencias transitivas exclusivas,
y el enlace mailto. La mención en seo-audit.md describe la auditoría histórica.

Seguridad ahora prepara nombre, teléfono, ciudad, tipo de cubierta, medidas y
observaciones antes de abrir WhatsApp. Las medidas pueden indicarse como por
confirmar para no bloquear una consulta. No se solicitan ni cargan archivos:
el cliente adjunta fotos, planos o documentos manualmente en WhatsApp.

No se cambia la geometría ni el precio de 121 MXN/m² de la calculadora térmica.
Los enlaces y el botón flotante siguen disponibles. El widget de VisitoAI y su
configuración permanecen intactos. No se añade automatización, API de WhatsApp,
almacenamiento de solicitudes, correo ni webhook.

## Número centralizado

lib/whatsapp.ts es la única configuración de producción del número internacional.
buildWhatsAppUrl codifica el mensaje una sola vez y se reutiliza en Calculator,
CTA, SecurityQuoteForm, WhatsAppButton y Footer. Para el cambio futuro al número
conectado a VisitoAI, modificar WHATSAPP_NUMBER y revisar los flujos antes de
publicar. No cambiar aún el número ni la configuración del widget.

## Estados y protección de solicitudes

Preparar un mensaje no lo envía. El cliente revisa el texto, abre WhatsApp y debe
pulsar enviar allí. La web no tiene confirmación verificable de recepción: nunca
muestra un estado de solicitud enviada/recibida. Seguridad conserva sus campos al cerrar y abrir su sección, editar o volver
desde WhatsApp mientras el componente siga montado. La vista previa permite copiar manualmente incluso si falla el portapapeles.
No se persisten datos personales: recargar/cerrar la página puede perder el borrador.
Los datos del mensaje se comparten con WhatsApp al abrir el enlace, no con analítica.

Los eventos de clic se denominan whatsapp_click (GA4) y WhatsAppClick (Meta custom).
La navegación interna no emite conversiones. Se conservan
quote_start y quote_price_shown. Se retiran los falsos eventos generate_lead,
qualify_lead, Meta Lead y la llamada de conversión de Ads asociada a esos clics.
Los scripts base de GA4, Meta, Ads y VisitoAI no cambian. Un clic no demuestra una
conversación recibida; esa confirmación futura requiere evidencia de WhatsApp/VisitoAI.

## Validación

- npm test: mensaje de seguridad y sus campos, Unicode y caracteres de URL,
  eventos de clic sin conversión ni datos personales, tolerancia a bloqueo de
  analítica, geometría térmica y precio/mensaje de ejemplo 8 × 4 m = 3,872 MXN.
- npm run build y npx tsc --noEmit --incremental false.
- git diff --check.
- Revisar en navegador el formulario, edición, vista previa, enlace, copia,
  persistencia al cerrar y abrir la sección de seguridad y calculadora. No enviar mensajes de prueba
  al negocio ni interpretar abrir WhatsApp como recepción.

Lint necesita configuración de ESLint que falta en el repositorio; este cambio
no introduce una configuración ajena al alcance.

## Publicación pendiente y riesgos

No hacer merge ni desplegar hasta que el propietario revise el PR y se resuelvan
los fallos de clonación de Hostinger. No se modificaron Hostinger ni sus variables.
Tras publicar con autorización, verificar rutas, enlaces y recepción real mediante
una prueba comercial coordinada. Clientes externos o pestañas antiguas que llamen
la API eliminada recibirán 404; no hay consumidores en el frontend actual, pero
no se han inspeccionado registros privados para descartar consumidores externos.

La entrega depende de que el cliente envíe el mensaje en WhatsApp y adjunte los
archivos; el sitio no puede garantizar recepción. Revisar dashboards/campañas que
usaban los anteriores eventos de lead: dejarán de recibir conversiones artificiales.
Las credenciales antiguas del servicio de correo pueden retirarse del proveedor y
hosting en una tarea posterior autorizada. No se modifican aquí.
