# Verificación Android de Franco — AQU-288 y AQU-289

Estado al 2 de noviembre de 2026: **pendiente de comprobación en Android**.
El usuario confirmó que no tiene un dispositivo Android disponible. No se
certifican cámara, GPS, diálogos de permiso, teclado móvil, reinicio de proceso
ni APK instalado mediante pruebas web o mocks.

La implementación y la preparación se incluyen para evitar improvisar el ensayo
cuando haya dispositivo. Esta lista no es evidencia de pasos ya ejecutados.

## Evidencia mínima a registrar al ejecutar

Dispositivo/modelo, versión Android, commit instalado, tipo y fecha del APK,
cuenta de prueba (sin contraseña/token), conectividad y resultado por caso.
Guardar capturas sin ubicación personal o datos sensibles; una foto de prueba
debe ser deliberadamente no sensible. Registrar incidencia y repetición si falla.

| Caso              | Pasos sobre datos de prueba desechables                              | Resultado esperado                                                              | Estado físico |
| ----------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------- |
| AQU-288 crear     | Con sesión y lago, capturar foto/GPS, fecha/nota; guardar offline    | Foto durable + registro local `pending_send`; confirmación posterior al disco   | Pendiente     |
| AQU-288 recuperar | Cerrar/reabrir proceso y abrir el borrador                           | Misma foto, ubicación/precisión, fecha y nota; no duplicación                   | Pendiente     |
| AQU-288 editar    | Cambiar nota y reemplazar foto; guardar                              | Actualiza mismo UUID; cancelar reemplazo conserva anterior                      | Pendiente     |
| AQU-288 eliminar  | Crear dos borradores; cancelar eliminación y luego confirmar uno     | Sólo desaparece el seleccionado y su carpeta; el otro permanece                 | Pendiente     |
| AQU-289 cámara    | Rechazar permiso temporal/permanente y cancelar cámara               | Campos intactos, guía para reintentar/Ajustes; finalizar deshabilitado sin foto | Pendiente     |
| AQU-289 ubicación | Rechazar permiso, apagar GPS, probar demora                          | Conserva campos, no inventa coordenadas; informa cómo continuar                 | Pendiente     |
| AQU-289 parcial   | Guardar sin foto o posición                                          | Se etiqueta como borrador incompleto, nunca captura finalizada/enviada/validada | Pendiente     |
| Teclado/lector    | Fecha/nota con teclado abierto, botones de captura/guardar, TalkBack | Etiquetas y avisos legibles; acciones alcanzables y foco usable                 | Pendiente     |

Eliminar desde la aplicación es irreversible. Usar sólo registros creados y
confirmados como desechables para este ensayo; no eliminar datos de terreno reales.

## Preparación comprobable sin dispositivo

Las suites `captureFlow`, `captureServices`, `cameraCapture`, `saveObservation`,
`nativePhotoStorage`, `deleteObservation` y `ObservationScreen` comprueban la
coordinación con dobles de sensores/Expo. `scripts/observation-store.test.mjs`
comprueba migración, recuperación, aislamiento y operaciones SQLite con archivos
temporales reales; eso no certifica SQLite dentro de un APK Android.

`scripts/capture-config.test.mjs` introspecciona permisos nativos generados.
Los E2E verifican navegador y memoria de sesión, no permisos físicos. La
exportación Hermes acredita empaquetado JavaScript, no compilación nativa.

## Condición de cierre

AQU-288 y AQU-289 deben conservar un estado no terminado hasta ejecutar y
registrar el ensayo correspondiente en Android. No cambiar a Done sólo porque
compila, existe una lista de pasos o pasan las simulaciones.
