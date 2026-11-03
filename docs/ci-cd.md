# Integración y entrega continua móvil

## Flujo del equipo

1. Cada cambio se desarrolla en una rama y se propone mediante un pull request a `main`.
2. GitHub Actions ejecuta `Mobile CI` en el pull request y al integrar en `main`. La comprobación instala dependencias con el lockfile, valida formato, ESLint, TypeScript y pruebas, comprueba dependencias Expo y exporta el bundle Android.
3. El equipo revisa el pull request y la evidencia manual que corresponda. Configura protección de `main` con `quality` como comprobación obligatoria y al menos una revisión antes de integrar.
4. Cuando se necesite una APK para probar en Android, ejecuta manualmente **Actions > Android Preview APK > Run workflow** desde el commit integrado en `main`. El trabajo `quality` debe pasar antes de iniciar EAS Build. El trabajo `build` espera el resultado del build; un éxito significa que EAS produjo la APK, no que la instalación ni las pruebas en el teléfono hayan pasado.
5. Registra el enlace del build de EAS, la versión y los resultados de la prueba en dispositivo en la tarea correspondiente. Una entrega de tienda usa el perfil `production` y requiere una decisión separada del equipo.

## Activación de la APK en CI

- Primero vincula este proyecto con la cuenta Expo autorizada y realiza una compilación interactiva local con el perfil `preview`. Eso configura el `projectId` real y las credenciales de firma Android necesarias para builds no interactivos.
- Crea un token de acceso de Expo con permisos para el proyecto y guárdalo en GitHub como secreto `EXPO_TOKEN`. No lo agregues al repositorio.
- Configura en el entorno EAS `preview` las variables públicas `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` que correspondan. Nunca pongas `service_role` en EAS ni en la app.
- La primera ejecución del workflow debe confirmar que la APK se genera e instala. La validación funcional en Android sigue siendo manual.

Los workflows quedan preparados localmente. Hasta que se integren en `main`, se configure la protección de rama, se vincule EAS y se añada `EXPO_TOKEN`, no ejecutarán la entrega automática ni producirán una APK desde CI.
