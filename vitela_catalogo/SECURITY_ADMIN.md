# Admin seguro — Vitela

## Arquitectura
- `/admin/` interfaz administrativa.
- `/api/admin/*` API protegida por Cloudflare Access + allowlist `ADMIN_EMAILS`.
- D1 (`VITELA_DB`) almacena el catálogo editable.
- `/api/catalogo` sirve únicamente productos activos al sitio público.
- No se guardan contraseñas ni secretos en el frontend.

## Configuración obligatoria antes de producción
1. Crear una base D1 y ejecutar `migrations/0001_init.sql`.
2. Vincularla al proyecto Pages como binding `VITELA_DB`.
3. Instalar la dependencia `@cloudflare/pages-plugin-cloudflare-access`.
4. Crear una aplicación de Cloudflare Access para `/admin/*` y para `/api/admin/*`.
5. Sustituir en `functions/admin/_middleware.js` y `functions/admin/api/_middleware.js` los placeholders `${CLOUDFLARE_ACCESS_DOMAIN}` y `${CLOUDFLARE_ACCESS_AUD}`.
6. Crear la variable no secreta `ADMIN_EMAILS` con una lista separada por comas de los correos permitidos.
7. Probar primero en Preview y después en Production.

## Importante
No agregues un password hardcodeado al HTML ni una API key de administrador al JavaScript. Cloudflare Access proporciona la identidad y el middleware valida el JWT. El backend vuelve a comprobar el correo autorizado antes de leer/escribir D1.

## Seguridad aplicada
- Validación de JWT mediante Cloudflare Access.
- Allowlist de administradores.
- Validación estricta de campos y límites de tamaño.
- SQL preparado (sin concatenación de entrada del usuario).
- Comprobación de `Origin` para mutaciones.
- CSP, X-Frame-Options, `nosniff`, Referrer-Policy, Permissions-Policy y HSTS en la API.
- `Cache-Control: no-store` para la API administrativa.
- No se renderiza HTML suministrado por el usuario.
