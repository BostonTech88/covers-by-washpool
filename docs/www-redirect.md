# Redirección a www: propuesta condicionada a verificar el proxy

## Investigación — 20 de noviembre de 2026

Base: origin/main 109617d; Next.js 15.5.18 desde package-lock.json.
Los cambios SEO anteriores ya están fusionados. No hay middleware ni otras
redirecciones de aplicación. HTTPS raíz y www responden 200 sin Location; también
robots.txt con query responde 200 en ambos nombres. Respuestas identifican hcdn y
Hostinger. No se accedió a hPanel ni a logs internos.

Hostinger documenta X-Forwarded-Proto para identificar HTTPS detrás de su CDN,
pero la documentación consultada no garantiza la preservación de Host ni la
sobrescritura/sanitización de X-Forwarded-Host. Las cabeceras de respuesta públicas
no muestran las cabeceras que recibe Node.js. No es posible confirmar esa parte
sin evidencia del proxy o del servidor.

En Next.js 15.5.18, `has: { type: "host" }` usa req.headers.host, pasa a minúsculas
y elimina el puerto; NO usa X-Forwarded-Host. Comprobado en el código instalado:
node_modules/next/dist/shared/lib/router/utils/prepare-destination.js.
Next también puede rellenar X-Forwarded-Host con Host cuando falta, de modo que
ver ambos iguales en la aplicación no demuestra que el proxy añadió ese header.

## Implementación y límites

next.config.ts incorpora una regla 308 para el Host exacto coversbywashpool.com,
con destino fijo https://www.coversbywashpool.com/:path*. El punto del dominio
está escapado porque la condición acepta expresiones regulares. Next conserva
la ruta y los valores de query, incluidos parámetros repetidos. Puede normalizar
su codificación; no se promete identidad byte por byte de la URL.

Está DESACTIVADA por defecto. Solo ENABLE_WWW_HOST_REDIRECT=true durante el build
incluye la regla en el manifiesto. Cambiar la variable después exige reconstruir.
No se añadió la variable a ningún entorno de hosting.

Se prefiere configuración sobre middleware: no requiere código por petición ni
interpretación manual de cabeceras de proxy. No confía en X-Forwarded-Host ni en
X-Forwarded-Proto; no implementa otra redirección de protocolo. Con Host preservado,
www nunca satisface la regla, incluso con X-Forwarded-Proto=http o X-Forwarded-Host
falsificado. El 308 conserva método y cuerpo: las peticiones POST al dominio raíz
se redirigen antes de ejecutar /api/quote. No cambia el handler del cotizador.
Next excluye sus recursos internos /_next/ de redirects personalizados y puede
aplicar antes su normalización de barras. No se altera ese comportamiento.

**Límite crítico:** si el proxy reemplaza Host por el dominio raíz incluso para
visitas a www, activar la regla causaría un bucle. Si lo sustituye por un nombre
interno, la regla no se aplicaría. Las pruebas locales NO descartan ninguno de
esos comportamientos de Hostinger. Esta rama es una propuesta, no está lista para
activación en producción hasta resolver esa incertidumbre.

## Condición previa de activación

Solicitar a soporte de Hostinger los valores entregados a Node.js de Host y
X-Forwarded-Host para peticiones HTTPS a ambos dominios, incluyendo ruta y query.
Confirmar expresamente que Host conserva el nombre solicitado tanto en raíz como
en www y que el CDN distingue ambos hosts al cachear. Pedir también cómo se tratan
cabeceras X-Forwarded-Host proporcionadas por el cliente y verificar que no existe
una redirección inversa www → raíz.

Si se realiza una prueba futura en staging, usar el mismo recorrido de proxy,
registrar solo esos encabezados y un identificador de petición, sin cookies ni
Authorization, y comprobar ambos dominios y cabeceras falsificadas. No se añadió
un endpoint público de diagnóstico ni se desplegó instrumentación.

Si Host no se preserva, NO activar esta regla. Solo considerar middleware basado
en X-Forwarded-Host si Hostinger garantiza que lo sobrescribe con el host original,
que no acepta valores aportados por clientes y que no hay acceso al origen que
eluda esa protección. No elegir arbitrariamente el primer elemento de una lista.

Si el proxy no ofrece una señal fiable, la alternativa más segura es pedir a
soporte una regla 301/308 en su proxy/CDN, condicionada al host exacto
coversbywashpool.com, que conserve ruta y query y apunte a HTTPS www. Esa capa ve
el dominio antes de cualquier reescritura. No requiere cambiar DNS ni debe coexistir
con esta regla de aplicación activa. Mantener el canonical existente entretanto.

## Verificaciones reproducibles

```sh
npm ci
ENABLE_WWW_HOST_REDIRECT=true npm run build
node --test tests/www-redirect.test.mjs
npx tsc --noEmit --incremental false
git diff --check
```

El test inicia y detiene un servidor LOCAL de producción en 127.0.0.1:3119;
requiere ese puerto libre y un build con la variable activada. Envía Host simulado,
prueba rutas, query repetida, caracteres codificados, 308, POST sin enviar correos,
segundo salto sin redirección, hosts ajenos y X-Forwarded-Host falsificado.
También comprueba que la configuración no emite reglas sin opt-in explícito.
No realiza peticiones POST a producción. No requiere credenciales de Resend.

Build con la regla, seis tests y TypeScript completados correctamente.
El lint sigue sin configuración en el repositorio, como en la auditoría anterior.
Diseño, componentes, cotizador, API, integraciones, dependencias y metadatos SEO
no se modifican. No se hizo merge, despliegue ni cambio de DNS o hosting.

## Fuentes

- https://nextjs.org/docs/15/app/api-reference/config/next-config-js/redirects
- https://www.hostinger.com/support/hostinger-cdn-visitor-ip-addresses-in-logs-and-analytics/
- https://www.hostinger.com/support/how-to-connect-a-custom-domain-to-a-node-js-application/
