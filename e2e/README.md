# AQU-41 — Login a detalle

`pnpm exec playwright install chromium` instala el navegador de pruebas.
`pnpm run test:e2e` levanta Expo en el puerto 8091 y ejecuta un Chromium aislado.

El recorrido real de la aplicación comprueba acceso privado, redirección al
login, envío del formulario, sesión mediante el SDK Supabase, regreso al perfil,
navegación por el catálogo y apertura del detalle con el token HTTP correspondiente.
Las respuestas de Supabase/API se simulan en el límite de red con datos de prueba;
no usa cuentas reales, claves privadas ni un bypass de autenticación en la app.
Se ignoran los .env locales durante la ejecución. Fallos conservan trazas locales
en test-results, excluido de Git.

Esta prueba certifica el flujo web con servicios simulados. No certifica el
backend desplegado, SecureStore nativo ni el renderizado Android de MapLibre.

Ejecución local del 29-09-2026: 1 prueba aprobada en Chromium (12,4 segundos
incluido el arranque), con el código de las rutas y clientes reales.
