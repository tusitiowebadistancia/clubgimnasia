# Despliegue experimental gratuito

Esta configuración usa Hostinger para el frontend, Render Free para la API Express/Prisma, Neon Free para PostgreSQL y un Worker de Cloudflare como disparador cada 15 minutos. Render Free puede suspender el servicio: el primer llamado luego de una suspensión puede tardar o fallar. No garantiza ejecuciones exactas cada 15 minutos.

## Variables de Render

Configurar como secretos o variables privadas en el servicio web:

- `NODE_ENV=production`
- `DATABASE_URL`: URL PostgreSQL de Neon con SSL.
- `APP_ORIGIN`: origen público del frontend Hostinger, sin barra final.
- `PUBLIC_SITE_URL`: URL pública del sitio, sin barra final.
- `SESSION_COOKIE_NAME`, `CSRF_COOKIE_NAME`, `SESSION_TTL_HOURS`.
- `NEGOPLUS_BASE_URL`, `NEGOPLUS_BRANCH_ID=5`, `NEGOPLUS_HEADERS_JSON`, `NEGOPLUS_TIMEOUT_MS`.
- `INTERNAL_SYNC_TOKEN`: valor aleatorio de al menos 32 caracteres.
- `SYNC_LOCAL_SCHEDULER_ENABLED=false`.

No usar valores con prefijo `VITE_` para secretos. Las credenciales de NegoPlus nunca se configuran en Hostinger ni en Cloudflare; `INTERNAL_SYNC_TOKEN` sí se carga como secreto compartido entre Render y el Worker.

En el build del frontend de Hostinger configurar `VITE_API_BASE_URL=https://<render-service>/api`. Es una URL pública, no un secreto; `APP_ORIGIN` en Render debe coincidir exactamente con el origen de Hostinger para CORS.

## Worker de Cloudflare

1. Crear un Worker desde `cloudflare-sync-worker/` con Wrangler, sin desplegar todavía.
2. Mantener el cron de `wrangler.toml`: `*/15 * * * *`.
3. Configurar `SYNC_ENDPOINT_URL` con `https://<render-service>/api/internal/sync`.
4. Cargar `INTERNAL_SYNC_TOKEN` mediante `wrangler secret put INTERNAL_SYNC_TOKEN` con el mismo valor de Render.
5. Desplegar el Worker solamente después de validar la API Render y los secretos.

El Worker registra en sus logs éxito, fallos y tiempo de respuesta. Cloudflare ejecuta el cron sin visitantes, pero su entrega y el arranque de Render Free no constituyen una garantía de puntualidad.

## Seguridad y concurrencia

- `POST /api/internal/sync` exige `Authorization: Bearer <INTERNAL_SYNC_TOKEN>` y compara el token en tiempo constante.
- El endpoint no usa cookies, sesión administrativa ni CSRF.
- `SyncLock` evita sincronizaciones concurrentes entre el cron, un arranque local o el botón administrativo.
- Una ejecución simultánea recibe `409`; el próximo cron podrá intentarlo otra vez.
- `SyncRun` registra fecha de inicio, finalización, estado, cantidades y error.

## Verificación administrativa

En Administración, `Resumen` consulta el último `SyncRun` y la última ejecución fallida. La ruta administrativa `GET /api/admin/sync` también lista las últimas 30 sincronizaciones para la pantalla correspondiente. Una ejecución satisfactoria tiene `status=SUCCESS` y `completedAt` definido; una revalidación de promociones fallida queda como `PARTIAL` sin aprobar promociones nuevas.

## Migraciones y prueba previa

Ejecutar las migraciones de Prisma desde una máquina o CI Node con acceso a Neon, nunca desde el Worker Cron. Antes de desplegar, verificar localmente `npm run backend:build`, `npm run backend:test`, `npm run lint` y `npm run build`. Luego probar en un entorno Neon no productivo:

1. Solicitud sin token e inválida: debe devolver `401`.
2. Solicitud con token correcto: debe crear un `SyncRun`.
3. Dos solicitudes simultáneas: una debe quedar bloqueada con `409`.
4. Falla o respuesta vacía de NegoPlus: debe dejar `SyncRun` en `FAILED` y conservar el catálogo previo.
