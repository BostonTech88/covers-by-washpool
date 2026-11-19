# Auditoría SEO técnica — 18 de noviembre de 2026

Base revisada: `6a411ce` (`BostonTech88/covers-by-washpool`).
Versión instalada desde package-lock.json: Next.js 15.5.18.

## Evidencia pública previa a los cambios

| URL | Respuesta | Destino |
| --- | --- | --- |
| http://coversbywashpool.com/ | 301 | https://coversbywashpool.com/ |
| https://coversbywashpool.com/ | 200 | Sin redirección |
| http://www.coversbywashpool.com/ | 301 | https://www.coversbywashpool.com/ |
| https://www.coversbywashpool.com/ | 200 | Sin redirección |
| https://www.coversbywashpool.com/robots.txt | 404 | — |
| https://www.coversbywashpool.com/sitemap.xml | 404 | — |

Cabeceras: `platform: hostinger`, `panel: hpanel`, `server: hcdn`.
DNS observado: raíz A 195.35.60.164 / 191.101.104.81; www CNAME
www.coversbywashpool.com.cdn.hstgr.net, A 195.35.60.80 / 212.1.212.97.
Las direcciones de CDN pueden variar. HTTPS funcionó en ambos nombres.
El HTTP de `/robots.txt?seo_audit=1` conserva ruta y consulta al pasar a HTTPS.

El HTML público tiene título y descripción en español, `lang="en"` y ningún
canonical. Ambos hosts HTTPS devuelven el mismo ETag. No se encontró metadataBase,
sitemap, robots, middleware, reglas de redirección ni configuración de hosting
versionada en el repositorio. La única página pública es `/`; `/api/quote` es un
endpoint POST. Search Console: www indexada y raíz duplicada, según información
del usuario; no se accedió a Search Console ni a hPanel.

## Cambios propuestos

- `lib/seo.ts`: origen único https://www.coversbywashpool.com.
- `app/layout.tsx`: metadataBase y lang es-MX; título y descripción conservados.
- `app/page.tsx`: canonical absoluto de portada, limitado a esa página para evitar
  que futuras rutas y los errores 404 hereden su canonical.
- `app/sitemap.ts`: únicamente la portada canónica. Sin fechas lastModified
  artificiales, anclas, API o rutas inexistentes.
- `app/robots.ts`: permite rastreo público, excluye /api/ y anuncia el sitemap www.
  Robots no es un mecanismo de protección ni garantiza desindexación.

No se modifican componentes visuales, CSS, cotizador, integraciones, analítica,
dependencias ni next.config.ts. No se añaden redirecciones de aplicación.

## Hosting pendiente de revisión antes del despliegue

La configuración interna de hPanel no fue accesible; los resultados anteriores
son observaciones públicas, no una exportación de sus reglas. No hay redirección
HTTPS sin www → www efectiva en las rutas comprobadas.

Revisar la selección del dominio principal y reglas existentes en Hostinger.
Configurar o corregir allí una única redirección permanente (301 o 308) de
coversbywashpool.com a https://www.coversbywashpool.com conservando ruta y query.
Reutilizar la política HTTPS existente y, si el hosting lo permite, resolver HTTP
sin www directamente hacia HTTPS www para evitar un salto adicional. Comprobar
que no exista una regla inversa ni bucles. No duplicar estas reglas en Next.js.

## Verificación y entrega

`npm ci`, `npm run build`, TypeScript y `git diff --check` completados.
`npm run lint` no ejecuta un análisis: falta configuración ESLint y Next abre un
asistente interactivo. No se cambió la infraestructura de lint en este trabajo.

Comprobado satisfactoriamente en servidor de producción local: portada y query con un único canonical
www, idioma es-MX, ausencia de noindex, sitemap XML y robots TXT con estado 200 y
content-type correcto, y 404 sin canonical de portada. Next.js serializa el
canonical raíz como https://www.coversbywashpool.com (sin barra final), equivalente
a la URL raíz con `/`.

Tras aprobar y desplegar, repetir las comprobaciones públicas, verificar la regla
del hosting y enviar https://www.coversbywashpool.com/sitemap.xml a Search Console.
La consolidación final de URLs depende del nuevo rastreo y decisión de Google.
No se hizo push, merge, despliegue ni modificación del hosting.

Referencia de API: https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata
