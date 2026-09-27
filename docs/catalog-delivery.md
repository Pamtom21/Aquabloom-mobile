# Catálogo, detalle y estaciones

Implementa AQU-37–40. Contrato de lectura contrastado con
[AquaBloomSur2do/aquabloom-sur, commit 160cf95](https://github.com/AquaBloomSur2do/aquabloom-sur/tree/160cf95e95ed916e9cc9ce19244f56f268d0154d/apps/api/app).
Ese repositorio se consultó exclusivamente como referencia; no fue modificado.

- GET /api/v1/lakes: usa text, region, page y limit. La interfaz conserva sus nombres search/page_size y los serializa al contrato real.
- GET /api/v1/lakes/{lake_id}: muestra nombre, región, estado y descripción.
- GET /api/v1/lakes/{lake_id}/stations: devuelve una lista sin paginación.
- El backend no ofrece GET /stations/{id}. La ficha móvil usa el listado del lago y valida la pertenencia; funciona al abrir un enlace directo.
- Las rutas validan UUID; los clientes validan las respuestas y propagan AbortSignal.
- Se muestran carga, vacío, enlaces inválidos y errores recuperables sin exponer detalles del servidor.

Los tres endpoints de lectura del backend de referencia son públicos y no
dependen de organización. El cliente no cambia las reglas de autorización del
backend ni incorpora operaciones de escritura.

Validación: formato, ESLint, TypeScript y 86 pruebas en 19 suites. Exportación
Android verificada. No se certifica una instancia desplegada ni un APK instalado.

El PR se apoya en la rama de autenticación del PR #4 y debe integrarse después
de ella. GitHub Actions no inició la ejecución del PR #4 por bloqueo de
facturación de la cuenta; los resultados anteriores corresponden al entorno local.
