# Meta Pixel + Conversions API — Grupo Comercial Vitela

## Configuración
1. En Meta Events Manager crea/selecciona el Pixel/Dataset y copia su ID a `meta-config.js`.
2. En Cloudflare Pages configura:
   - `META_PIXEL_ID` = mismo ID.
   - `META_CAPI_ACCESS_TOKEN` = token secreto de CAPI.
   - `META_GRAPH_VERSION` = versión actual de Graph API (opcional; por defecto `v26.0`).
   - `META_TEST_EVENT_CODE` = opcional, úsalo únicamente para validar en Test Events.
3. No pongas `META_CAPI_ACCESS_TOKEN` en archivos públicos.

## Eventos
- `PageView`: carga de cada página.
- `ViewContent`: abrir un producto de menudeo o un paquete de mayoreo.
- `Contact`: clics a WhatsApp desde inicio/menudeo.
- `Lead`: clic “Lo quiero” de un paquete de mayoreo.

Pixel y CAPI comparten el mismo `event_id` para la misma acción, para permitir la deduplicación en Meta.

## Cloudflare
La función `functions/api/meta-capi.js` expone `POST /api/meta-capi` y agrega IP/UA del visitante desde los headers de Cloudflare, además de `_fbp`/`_fbc` cuando están disponibles.
