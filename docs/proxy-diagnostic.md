# Diagnóstico temporal de Hostinger CDN

Endpoint: `/api/internal/proxy-diagnostic`. Rama basada en main, independiente de
la propuesta de redirección. No modifica next.config.ts ni activa redirecciones.

## Protección

El endpoint solo funciona con ENABLE_PROXY_DIAGNOSTIC=true y un
PROXY_DIAGNOSTIC_SECRET de exactamente 64 caracteres hexadecimales minúsculos,
correspondientes a 32 bytes (256 bits) generados con un CSPRNG. Es un requisito
más estricto que 32 caracteres. Falta de variable, secreto corto o formato inválido
lo desactivan. El formato no permite demostrar entropía: no elegir manualmente
una cadena ni reutilizar contraseñas. Generar un secreto nuevo para esta prueba.

Solo GET con Authorization: Bearer <secreto> obtiene un objeto JSON con exactamente
Host y X-Forwarded-Host. No se copian otros encabezados, IP, URL, cookies ni datos
del entorno. Se comparan hashes SHA-256 de longitud fija con timingSafeEqual.
Credenciales incorrectas, estado desactivado y métodos no admitidos devuelven 404
con cuerpo vacío. No se aceptan credenciales por query ni cookies.

Todas las respuestas del handler usan Cache-Control private/no-store/max-age=0,
CDN-Cache-Control no-store, Surrogate-Control no-store, Vary Authorization y
X-Robots-Tag noindex/nofollow/noarchive. Es una ruta dinámica Node.js. No registra
solicitudes ni cabeceras completas y no habilita CORS. La instrumentación temporal
registra únicamente estados enumerados en logs privados, con límites estrictos;
ver [procedimiento de instrumentación](proxy-auth-instrumentation.md). No se añade al sitemap; robots ya
excluye /api/. Los errores que genere infraestructura antes de llegar al handler
no están bajo control de este código. Tampoco puede controlar la política de
logs del proveedor: no habilitar captura de Authorization/cookies en el hosting.

## Configuración futura en Hostinger — requiere autorizar despliegue

No se configuraron variables ni se desplegó nada al preparar este PR.

1. Generar localmente el secreto con `openssl rand -hex 32` y guardarlo en un
   gestor de contraseñas. No copiarlo a Git, chats, PRs, capturas ni archivos de
   diagnóstico. No incluirlo en una URL.
2. En el panel de la aplicación Node.js existente, abrir Environment Variables
   (o Settings & Redeploy / Deployments → Redeploy según la interfaz).
3. Añadir PROXY_DIAGNOSTIC_SECRET con el valor generado, sin comillas ni espacios.
   Añadir ENABLE_PROXY_DIAGNOSTIC con valor true solo durante la ventana de prueba.
   Son variables privadas del servidor; NO usar NEXT_PUBLIC_ ni next.config.env.
4. Mantener la redirección desactivada: no configurar ENABLE_WWW_HOST_REDIRECT=true
   ni incorporar la otra rama. Mantener intactas las demás variables e integraciones.
5. Tras aprobar el código y autorizar publicación, desplegarlo mediante el flujo
   existente. Hostinger puede requerir un redeploy para aplicar variables.
6. No crear reglas de caché para esta ruta. Si hay una regla del CDN que ignora
   no-store, excluir esta ruta ANTES de activarla; verificarlo con soporte si se
   desconoce. Las pruebas locales no certifican el comportamiento de su CDN.

Documentación oficial de variables:
https://www.hostinger.com/support/how-to-edit-or-add-environment-variables-after-deployment/

## Prueba desde un equipo de confianza

Ejecutar el siguiente script localmente después del despliegue autorizado. Pide
el secreto sin eco; no lo coloca en argumentos de proceso, historial o URL.
No sigue redirecciones para evitar reenviar la credencial a otro destino.
Solo imprime estado, política de caché y los dos encabezados permitidos. No usar
curl -v ni herramientas que registren Authorization. No adjuntar el secreto al PR.

```python
import getpass
import json
import urllib.request
import urllib.error

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

opener = urllib.request.build_opener(NoRedirect)
secret = getpass.getpass('Secreto temporal: ')
path = '/api/internal/proxy-diagnostic'

def probe(host, forwarded=None, authenticated=True):
    headers = {}
    if authenticated:
        headers['Authorization'] = 'Bearer ' + secret
    if forwarded is not None:
        headers['X-Forwarded-Host'] = forwarded
    req = urllib.request.Request('https://' + host + path, headers=headers)
    try:
        response = opener.open(req, timeout=20)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        status = response.code
        cache = response.headers.get('Cache-Control', '')
        payload = response.read()
    print(host, 'XFH enviado:', forwarded, 'autenticada:', authenticated,
          'estado:', status, 'Cache-Control:', cache)
    assert 'no-store' in cache.lower(), 'Detener: falta no-store'
    if authenticated:
        assert status == 200, 'Detener: diagnóstico no disponible'
        data = json.loads(payload)
        assert set(data) == {'Host', 'X-Forwarded-Host'}
        print(data)
    else:
        assert status == 404 and payload == b'', 'Detener: respuesta anónima inesperada'

for host in ['coversbywashpool.com', 'www.coversbywashpool.com']:
    probe(host, authenticated=False)
    for forwarded in [None, 'probe.invalid', 'probe.invalid, coversbywashpool.com']:
        probe(host, forwarded)
        # Misma URL, sin cache-buster: comprueba que no se reutiliza el JSON privado.
        probe(host, authenticated=False)
```

Si una petición anónima recibe JSON, detener la prueba, desactivar el endpoint,
solicitar purga de esa ruta en el CDN y comprobar la política de caché antes de
continuar. No activar la redirección a partir de resultados incompletos.

## Interpretación

- Host raíz para raíz y Host www para www: evidencia de que se conserva la
  distinción necesaria para la regla basada en Host. Comprobar en ambas direcciones.
- Host idéntico en ambos o nombre interno: NO activar la regla basada en Host;
  podría no funcionar o producir un bucle.
- X-Forwarded-Host contiene probe.invalid o la lista enviada: el valor puede venir
  del cliente; no confiar en él como identidad del dominio original.
- X-Forwarded-Host sustituido consistentemente por el dominio solicitado: evidencia
  favorable, pero pedir confirmación de sanitización al proveedor y de que no se
  puede eludir ese proxy antes de usarlo como fuente de confianza.

Next.js puede completar X-Forwarded-Host con Host cuando está ausente. Estos son
los valores que observa el handler, NO una captura anterior a Next.js; que ambos
coincidan no demuestra que Hostinger haya generado X-Forwarded-Host.
No se toman decisiones ni se activan redirecciones automáticamente.

## Pruebas locales

```sh
npm ci
npm run build
node --test tests/proxy-diagnostic*.test.mjs
npx tsc --noEmit --incremental false
git diff --check
```

Las pruebas HTTP usan el build de producción en 127.0.0.1:3121 (puerto libre),
secretos aleatorios efímeros y variables solo en procesos hijos. Detienen sus
servidores al terminar. Comprueban desactivación, secreto insuficiente, rechazo de
credenciales, respuesta limitada, no-store, métodos no admitidos y ausencia de
credenciales/cookies de prueba en stdout/stderr. No contactan Hostinger ni envían
cotizaciones. Los tests del handler cubren además la falta de ambos encabezados
por separado de la normalización de Next.js.

## Eliminación completa al terminar

1. Poner ENABLE_PROXY_DIAGNOSTIC=false o eliminarla y aplicar el cambio con el
   reinicio/redeploy que requiera Hostinger. Verificar 404 vacío incluso con el
   secreto anterior en ambos dominios. Retirar PROXY_DIAGNOSTIC_SECRET.
2. Preparar un commit que elimine exclusivamente:
   - app/api/internal/proxy-diagnostic/route.ts
   - tests/proxy-diagnostic.test.mjs
   - tests/proxy-diagnostic-http.test.mjs
   - tests/proxy-diagnostic-status.test.mjs
   - docs/proxy-auth-instrumentation.md
   - docs/proxy-diagnostic.md (este procedimiento)
3. Revisar y desplegar esa eliminación. Verificar 404 en la URL de ambos dominios,
   autenticada y anónima; la 404 estándar de Next.js ya puede tener cuerpo HTML.
4. Confirmar que ambas variables ya no existen en Hostinger y retirar el secreto
   del gestor de contraseñas. No revertir otros cambios SEO o commits posteriores.
5. Si existió cualquier caché contraria a no-store, purgar la ruta del CDN.
   La desactivación por variable no sustituye la eliminación del código.

No se necesita editar DNS, redirecciones, diseño, cotizador, analítica ni integraciones.
