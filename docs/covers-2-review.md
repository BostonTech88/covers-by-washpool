# Covers 2.0 — guía de revisión

Fecha: 27 de noviembre de 2026. Rama: `codex/covers-2-sales-redesign`.
Base: `origin/main` en `46bb057c6139ee034debb62340a16ab4cc739429`.
Estado: propuesta para revisión; sin merge ni despliegue.

## Experiencia comercial

La portada prioriza cubiertas térmicas a medida, con dos accesos desde el inicio:
calcular un estimado o hablar directamente por WhatsApp. El nuevo diseño utiliza
azul marino, turquesa, fotografías reales, tipografía del sistema y navegación
compacta en móvil. La estructura contiene diferenciadores, beneficios, calculadora,
tres pasos de compra, galería, preguntas frecuentes y llamada final a cotizar.
Seguridad ocupa una sección secundaria desplegable antes del pie de página.

La calculadora conserva $121 MXN/m² y sus fórmulas: largo por ancho, área circular
y suma de dos rectángulos para forma de L. Se rechazan dimensiones negativas,
no numéricas o que produzcan desbordamiento; no se alteran los cálculos válidos.
Se eliminan ciudad, código postal y registro de la calculadora. Las formas
irregulares solicitan cotización personalizada. Editar medidas invalida el
resultado anterior. El total y envío deben confirmarse por WhatsApp.

El formulario secundario conserva nombre, teléfono, ciudad, medidas y observaciones;
el tipo de cubierta es Seguridad. Prepara un texto revisable, permite copiarlo y
abrir WhatsApp. Fotografías y documentos se adjuntan manualmente allí. Nunca se
muestra una confirmación de envío o recepción por abrir el enlace. Los borradores
no se guardan fuera de la memoria de la página.

## WhatsApp y retirada del correo

`lib/whatsapp.ts` centraliza el número actual 525548919773. No se añade API,
automatización, checkout ni integración con Stripe. El widget existente de
VisitoAI y los scripts base de analítica permanecen intactos. El botón propio se
ubica a la izquierda y se oculta cuando los formularios están en pantalla para
no taparlos; sus enlaces de contacto siguen disponibles dentro de las secciones.

Se eliminan `app/api/quote/route.ts`, el paquete `resend`, sus dependencias
transitivas exclusivas y el enlace de correo del pie. La auditoría de la base no
encontró formularios que llamaran a esa API. Se elimina `components/Specs.tsx`,
reemplazado por la sección secundaria de seguridad para evitar experiencias duplicadas.
No quedan referencias a las antiguas variables de correo en código de producción.

La analítica registra `whatsapp_click` y `WhatsAppClick` como clics, sin datos del
formulario. Se mantienen los eventos de inicio y precio calculado. Se retiran
conversiones de lead que se disparaban por mera intención de abrir WhatsApp.

## SEO y contenido

Se conservan `metadataBase`, canonical con www, idioma `es-MX`, sitemap y robots
existentes, sin cambios de dominio ni redirecciones. La portada actualiza título,
descripción, Open Graph y Twitter con una imagen real. Incluye un único H1,
secciones semánticas, enlaces internos y FAQ renderizadas en HTML incluso cerradas.

JSON-LD describe Organization y Product con datos del negocio y producto; no añade
precios de oferta final, valoraciones, garantías, certificaciones o direcciones
inventadas. Product sin ofertas/reseñas puede no ser elegible para resultados
enriquecidos. No se crean páginas superficiales ni políticas legales ficticias.
Estas mejoras facilitan comprensión e indexación; no garantizan posiciones o
citas en buscadores con IA.

Referencias consultadas:
- [Referencia visual Visito](https://www.visitoai.com/es), principios de claridad y jerarquía, sin copiar componentes o textos.
- [Metadatos Next.js 15](https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata).
- [Google: funciones de IA y sitios web](https://developers.google.com/search/docs/appearance/ai-features).

## Fotografías

Se revisaron visualmente 51 imágenes originales del repositorio. Los originales
se conservan; los archivos derivados se encuentran en `public/images/`, con
orientación corregida, dimensiones reducidas y metadatos eliminados.

| Archivo derivado | Original | Uso |
| --- | --- | --- |
| thermal-hero.webp | hero-6.jpg | Hero y galería |
| thermal-curves.webp | hero-1.jpg | Galería |
| thermal-terrace.webp | hero-4.jpg | Galería |
| thermal-garden.webp | hero-5.jpg | Beneficios y galería |
| thermal-long.webp | 20240605_124154.jpg | Galería |
| thermal-roller.webp | 20240110_114550.jpg | Galería |
| thermal-indoor.webp | 20240122_114528.jpg | Galería |
| thermal-round.webp | 20230322_122052.jpg | Galería |
| safety-cover.webp | seguridad-1.jpg | Sólo sección secundaria |
| logo.webp | logo-covers.jpeg | Navegación y pie |
| share-cover.jpg | hero-6.jpg | Imagen social 1200 × 630 |

La galería principal muestra seis fotos inicialmente y permite revelar ocho.
El diálogo nativo permite ampliarlas, cerrar con Escape y recuperar el foco.
`lib/gallery.ts` concentra fotos, descripciones y procedencia para reemplazos futuros.
El hero tiene prioridad; las demás imágenes aprovechan Next Image y carga diferida.

## Verificaciones realizadas

- `npm run build`: correcto, Next.js 15.5.18; portada estática y sitemap/robots generados.
- `npx tsc --noEmit --incremental false`: correcto.
- `npm test`: siete pruebas aprobadas. Seis cubren mensajes, número único,
  codificación Unicode, eventos de clic, fórmulas, precio y dimensiones inválidas.
  La séptima arranca un servidor de producción local y verifica HTML/SEO,
  JSON-LD, anclas, enlaces WhatsApp, fotos optimizadas, sitemap/robots y 404 de
  GET/POST a la API retirada.
- Ejemplo rectangular 8 × 4 m: 32 m² y $3,872 MXN.
- `git diff --check`: correcto.
- `npm run lint`: no completa análisis; el repositorio carece de configuración
  ESLint y el comando solicita configuración interactiva. No se declara aprobado.
- Revisión visual previa en Chrome: escritorio y emulación móvil 390 × 844,
  navegación móvil, fotos, cálculo rectangular, invalidación al editar y flujo
  irregular. Apertura/cierre del diálogo y recuperación del foco comprobados.
- La revisión local bloqueó solicitudes externas mediante un proxy local para
  evitar contaminar analítica. Ese proxy no forma parte del cambio ni del hosting.

No se enviaron mensajes reales. Pendientes de verificación manual completa:
formulario secundario de extremo a extremo, copiar mensaje, botón de mostrar más
fotos, dispositivos físicos y coexistencia con el widget remoto. No se adjuntan
capturas finales: el control de pestaña aislada no estuvo disponible en esta sesión.
No se midieron Core Web Vitals de producción ni se afirma una puntuación Lighthouse.

## Archivos y organización

- Portada y estilos: `app/page.tsx`, `app/globals.css`.
- Componentes actualizados: Nav, Hero, FeatureList, Calculator, Process, CTA,
  Footer y WhatsAppButton.
- Componentes nuevos: Gallery, FAQ, SafetyCover, SecurityQuoteForm y WhatsAppLink.
- Lógica/configuración: `lib/calculator.ts`, `lib/whatsapp.ts`,
  `lib/whatsapp-quote.ts`, `lib/gallery.ts`, `lib/faq.ts`, `lib/analytics.ts`.
- Dependencias: `package.json`, `package-lock.json`.
- Pruebas: `tests/whatsapp.test.mjs`, `tests/site-http.test.mjs`.
- Documentación: este archivo y `docs/whatsapp-quotes.md`.
- Eliminados: API de correo y componente Specs.
- Añadidos: once derivados de imágenes enumerados arriba.

## Riesgos y siguiente paso

Revisar el PR y completar la revisión manual antes de autorizar publicación.
Los fallos de clonación reportados en Hostinger siguen pendientes; esta tarea no
modifica su configuración ni verifica que hayan quedado resueltos. No se integran
ramas antiguas de diagnóstico o redirección.

Clientes externos o pestañas antiguas que usen la API retirada recibirán 404;
no se consultaron registros privados para descartar esos consumidores. Revisar
campañas que dependían de falsos eventos de lead. El negocio sólo recibe una
solicitud cuando el cliente envía el mensaje dentro de WhatsApp. La recepción
real y el futuro número de VisitoAI requieren validación coordinada posterior.
Las credenciales de correo del proveedor/hosting no se modificaron.
