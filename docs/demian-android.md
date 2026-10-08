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

## Vinculación pendiente

EAS CLI devolvió `Not logged in`. Falta iniciar sesión y elegir el proyecto del
equipo; no se añadió un projectId ficticio ni se creó un proyecto en otra cuenta.
En una instalación estándar de Node con npm:

```sh
npx eas-cli@24.8.0 login
npx eas-cli@24.8.0 init
npx eas-cli@24.8.0 config --platform android --profile development
npx eas-cli@24.8.0 build --platform android --profile development
```

Antes del build, configurar las tres variables públicas indicadas en README en
el entorno EAS seleccionado. Las claves de servidor y firma no se guardan en
Git. Registrar el projectId real tras vincular el proyecto autorizado.

## AQU-43 — Build e instalación pendientes

No hay Android SDK/adb disponible en este equipo y EAS no está autenticado.
No se ha generado ni instalado un APK. Cuando exista el build, registrar URL/ID,
commit, dispositivo y versión Android, e instalarlo en un emulador o teléfono.
Verificar arranque, login, restauración tras reiniciar, logout, catálogo, detalle,
mapa, polígonos, estaciones, ficha inferior y reintento sin red. Adjuntar evidencia
real antes de dar esta tarea por terminada.
