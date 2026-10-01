# AQU-42 — Configuración Android de EAS

Los perfiles heredan Node 24.3.0 y pnpm 11.5.0, coherentes con el repositorio.
Cada perfil selecciona su entorno EAS explícitamente para evitar mezclar los
servicios de desarrollo, preview y producción. La versión mínima de EAS CLI es
24.8.0, utilizada para validar esta configuración.

| Perfil      | Distribución | Artefacto | Cliente de desarrollo |
| ----------- | ------------ | --------- | --------------------- |
| development | internal     | APK       | Sí                    |
| preview     | internal     | APK       | No                    |
| production  | store        | AAB       | No                    |

El perfil base sólo comparte herramientas; se debe compilar con uno de los tres
perfiles de entrega. El paquete Android actual es `com.aquabloom.mobile`.

## Verificación local

Los tres perfiles se resolvieron correctamente con EasJsonAccessor/EasJsonUtils
de la distribución oficial EAS CLI 24.8.0. La exportación JavaScript Android
también pasó. Esto valida estructura, herencia y tipos de artefacto; no genera
un APK ni comprueba firma o instalación.

## Proyecto vinculado

El 30-09-2026 se inició sesión y se vinculó el proyecto autorizado en la cuenta
personal `deimon005`, sin crear una cuenta adicional.
Proyecto: https://expo.dev/accounts/deimon005/projects/aquabloom-mobile
ID: `a74e1336-41eb-4ee3-bcb6-6b208d1a19f2`.
`eas config --platform android --profile preview --non-interactive` pasó.
En una instalación estándar de Node con npm:

```sh
npx eas-cli@24.8.0 login
npx eas-cli@24.8.0 init
npx eas-cli@24.8.0 config --platform android --profile preview
npx eas-cli@24.8.0 build --platform android --profile preview
```

Para probar autenticación y datos reales, configurar las tres variables públicas
indicadas en README en el entorno EAS seleccionado y generar otro build. El primer
instalador prueba el esqueleto sin servicios configurados: no certifica login,
catálogo ni geometrías remotas. Las claves de servidor y firma no se guardan en Git.

## AQU-43 — APK generado

Build: https://expo.dev/accounts/deimon005/projects/aquabloom-mobile/builds/74b7edf7-dbb1-473e-90af-b6867b152372
APK: https://expo.dev/artifacts/eas/HxSEcorPQDBKaoJx4kJqMknW2F2EKZax2VKI0sSX47A.apk
Perfil `preview`, paquete `com.aquabloom.mobile`, versión 1.0.0 (1).
Fuente: commit `40866452e9c87ea43ef81e2d67aa41664055e065` más la vinculación real
en `app.json`, incorporada después al commit de AQU-43. EAS generó la clave de
firma y terminó el build el 01-10-2026 a las 03:00:17 UTC. El enlace respondió
HTTP 200 y entrega un archivo de 149.898.955 bytes.
No hay variables públicas configuradas en el entorno preview.
El instalador corresponde a `demian/sprint-1`; no incorpora los once commits
adicionales observados en `origin/franco` (punta `6cc288f`). La integración final
del equipo requiere revisar esos cambios por separado.
No hay Android SDK/adb disponible en este equipo. El 01-10-2026 Demian confirmó
la instalación y apertura correctas en un teléfono Android físico. El APK funciona
de forma independiente y no necesita el computador, Metro ni Expo Go.
Verificar arranque, login, restauración tras reiniciar, logout, catálogo, detalle,
mapa, polígonos, estaciones, ficha inferior y reintento sin red. Adjuntar evidencia
real antes de dar esta tarea por terminada.
