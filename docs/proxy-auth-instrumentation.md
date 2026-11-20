# Instrumentación privada temporal de autenticación

## Alcance y privacidad

La respuesta HTTP no cambia: GET autorizado devuelve exclusivamente Host y
X-Forwarded-Host; cualquier fallo devuelve 404 vacío. Se mantienen todos los
encabezados no-store y la autenticación obligatoria. Otros métodos no registran
estados y continúan devolviendo 404. No se toca diseño, cotizador, analítica,
integraciones, DNS ni redirecciones.

Cada GET puede emitir un objeto JSON en stdout del servidor con estas únicas claves:

| Clave | Estados y significado |
| --- | --- |
| flag | missing: variable ausente; invalid: presente pero distinta de true exacto; enabled: true exacto |
| secret | missing: ausente o vacía; invalid: formato distinto de 64 hexadecimales minúsculos; valid: formato correcto |
| authorization | absent: encabezado ausente; invalid_scheme: no cumple Bearer seguido de un espacio y credencial sin espacios; mismatch: no coincide; match: coincide |

Si el encabezado tiene sintaxis Bearer válida pero el secreto está ausente o es
inválido, se omite authorization: no es posible comparar y no se inventa mismatch.
valid solo valida formato, no prueba aleatoriedad. match puede aparecer con flag
invalid; la respuesta seguirá siendo 404. Los hashes usados en la comparación
constante no se registran. No se registran valores, longitudes, hashes, cookies,
contraseñas, IP, URL ni encabezados completos. Tampoco se retornan estos estados
por HTTP. Un fallo al escribir el log no modifica la respuesta.

Los logs requieren acceso privado a Hostinger. El proveedor puede añadir su propio
sobre de fecha/metadatos; este código no controla los logs de infraestructura.
No habilitar captura de Authorization, cookies ni volcado del entorno.

## Límites y activación

- Máximo 20 eventos por instancia del proceso.
- Máximo 15 minutos desde el primer GET registrado, medidos con reloj monotónico.
- Caducidad absoluta: 27 de noviembre de 2026, 22:00 UTC (16:00 Ciudad de México).
- Después del límite, el endpoint sigue autenticando normalmente, sin nuevos logs.
- Reinicios y múltiples workers pueden renovar la cuota/ventana por proceso antes
  de la caducidad absoluta. No es una cuota global del hosting.

No hay una variable adicional para habilitar los logs: se investiga precisamente
si las variables llegan al proceso. Los estados se registran incluso si el endpoint
está desactivado. Las peticiones anónimas pueden consumir la cuota. No usar esta
instrumentación como monitor permanente. Si se publica después de la caducidad,
revisar otra fecha mediante un nuevo cambio aprobado; no extenderla automáticamente.

## Prueba futura, solo tras autorizar despliegue

Este PR no publica nada. Mantener ENABLE_WWW_HOST_REDIRECT desactivada.

1. Revisar el PR y autorizar por separado el despliegue. Verificar que el commit
   correcto figure como Actual y que la fecha esté dentro de la ventana.
2. Abrir los logs de ejecución privados de la aplicación, no solo los de build.
   No imprimir variables ni pegar secretos en capturas o conversaciones.
3. Ejecutar GET (no HEAD) de forma secuencial en ambos dominios. Primero una
   petición sin Authorization y luego otra con la credencial guardada. No seguir
   redirecciones. Usar entrada oculta del secreto, nunca URL o argumentos visibles.
4. Para una prueba mínima que tolera los 404, usar localmente:

```python
import getpass
import urllib.request
import urllib.error

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None

opener = urllib.request.build_opener(NoRedirect)
secret = getpass.getpass('Secreto temporal: ')
for domain in ['coversbywashpool.com', 'www.coversbywashpool.com']:
    for authenticated in [False, True]:
        input(f'Preparar logs para {domain}, autenticada={authenticated}; Enter: ')
        headers = {'Authorization': 'Bearer ' + secret} if authenticated else {}
        req = urllib.request.Request('https://' + domain + '/api/internal/proxy-diagnostic', headers=headers)
        try:
            response = opener.open(req, timeout=20)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            print('HTTP', response.code, 'no-store:', 'no-store' in response.headers.get('Cache-Control', '').lower())
```

El script no imprime cuerpos, secretos ni encabezados privados. Las fallas de red
no demuestran un resultado de autenticación. No usar trazas verbosas del cliente.

## Interpretación y límites de evidencia

- flag missing/invalid: revisar inyección y valor exacto de ENABLE_PROXY_DIAGNOSTIC.
- secret missing/invalid: revisar inyección y formato de PROXY_DIAGNOSTIC_SECRET.
- authorization invalid_scheme: corregir formato del cliente.
- authorization mismatch con secret valid: credencial distinta de la disponible
  en ese proceso; comprobar también qué despliegue/worker atiende.
- authorization absent en una petición que el cliente configuró con Bearer:
  compatible con eliminación del encabezado en el trayecto, pero no demuestra
  por sí solo que el CDN sea responsable. Confirmar cliente y pedir a Hostinger
  revisión privada del proxy, sin compartir la credencial.
- enabled + valid + match debe dar 200 en este handler. Un 404 observado en ese
  caso requiere comprobar correlación, ruta, CDN y proceso, no saltar autenticación.
- Sin eventos: posible ruta/proceso diferente, método HEAD, cuota agotada,
  ventana/caducidad vencida o visibilidad de logs. No prueba variables ausentes.

No se incluyen identificadores, dominios ni timestamps en el objeto registrado.
La correlación es manual y aproximada: una petición a la vez; tráfico concurrente
puede impedir atribuir un evento. No concluir que un encabezado fue eliminado
solo por observar un evento absent que podría corresponder a una petición anónima.

## Verificación y retirada

Pruebas: `npm run build`, `node --test tests/proxy-diagnostic*.test.mjs`,
`npx tsc --noEmit --incremental false` y `git diff --check`.
La suite nueva usa relojes simulados y secretos efímeros; verifica estados exactos,
ausencia de datos sensibles, límites, caducidad, métodos y fallas del logger.

Para retirar SOLO la instrumentación, preparar otro PR: eliminar el bloque
TEMPORARY, sus tipos/estado y llamada; restaurar la validación original de GET
consultando el archivo en el commit 3f440317 (comparar antes de restaurar si hay
cambios posteriores). Eliminar tests/proxy-diagnostic-status.test.mjs y este
documento, y retirar la referencia desde docs/proxy-diagnostic.md. Mantener los
tests originales y ejecutar toda la verificación. Tras aprobación y despliegue,
comprobar que ya no se emiten objetos de estados. El vencimiento no borra logs
anteriores: retirarlos o esperar la retención del proveedor según sus controles.

Para eliminar TAMBIÉN el endpoint, seguir la sección de eliminación completa de
[proxy-diagnostic.md](proxy-diagnostic.md), retirar las dos variables y revocar
el secreto. Desactivar ENABLE_PROXY_DIAGNOSTIC no detiene por sí solo estos logs
antes de sus límites: la eliminación del código es la retirada definitiva.
