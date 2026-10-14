# Sprint 2 móvil — Semana 2 de Franco

Entrega del 14 de octubre de 2026 para **sprint 2 - movil**, hito
**Semana 2 — Captura en terreno (8–14 de octubre)**. Sólo comprende las cuatro
tareas asignadas a Franco; no da por terminadas las dependencias de otros integrantes.

| Issue                                                                                                      | Aceptación implementada                                                                                                 | Evidencia automatizada                                                                |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [AQU-263](https://linear.app/aquabloom/issue/AQU-263/m2-17-solicitar-permiso-de-camara)                    | Explicación contextual, permiso al pulsar cámara, rechazo recuperable y orientación a Ajustes sin bloquear el borrador. | `cameraCapture.test.ts`, `captureFlow.test.tsx`, `capture-config.test.mjs`            |
| [AQU-264](https://linear.app/aquabloom/issue/AQU-264/m2-18-capturar-una-fotografia-por-observacion)        | Una captura local por observación; cancelar conserva foto anterior, nota y fecha.                                       | `cameraCapture.test.ts`, `captureFlow.test.tsx`, `captureServices.test.ts`            |
| [AQU-265](https://linear.app/aquabloom/issue/AQU-265/m2-19-mostrar-vista-previa-y-reemplazo-de-fotografia) | Vista previa accesible y reemplazo antes de guardar; una imagen inaccesible impide finalizar hasta reemplazarla.        | `captureFlow.test.tsx`                                                                |
| [AQU-266](https://linear.app/aquabloom/issue/AQU-266/m2-20-conectar-formulario-captura-y-guardado)         | Valida campos, conserva foto antes de SQLite y confirma el borrador local pendiente de envío sólo después del guardado. | `saveObservation.test.ts`, `ObservationScreen.test.tsx`, `observation-store.test.mjs` |

## Recorrido de aceptación

1. Reconstruir el development build nativo con `pnpm run android:build`. Los nuevos módulos y permisos no llegan al teléfono sólo reiniciando Metro.
2. Abrir un lago, acceder a Observaciones e iniciar sesión si corresponde.
3. Escribir fecha/hora local y nota. Pulsar **Tomar fotografía** tras leer su propósito.
4. Rechazar el permiso: se informa cómo reintentar o habilitarlo en Ajustes; se puede continuar editando, volver al lago y guardar un borrador incompleto.
5. Autorizar y capturar: aparece una única vista previa. **Reemplazar fotografía** cambia esa imagen; cancelar no pierde la anterior ni los campos.
6. Pulsar **Capturar ubicación**: se solicita permiso de primer plano y posición actual con precisión disponible. No se inventan coordenadas ni se usa una posición antigua como reemplazo silencioso.
7. Pulsar **Finalizar observación** con foto disponible, ubicación y datos válidos. Se guarda localmente como `pending_send`, no validado y sin petición de subida.
8. Volver al lago y reabrir: se recuperan campos, coordenadas y URI persistente del mismo propietario y entorno API.

La UI evita acciones duplicadas mientras captura o guarda. Si la captura falla,
el GPS está desactivado, no hay precisión válida o vence el límite de 20 segundos,
se informa sin descartar los campos. Si falla el disco, no se presenta éxito falso.
Cambiar de sesión o desmontar la pantalla invalida resultados tardíos de captura
y preparación de archivos antes de escribir el registro.

## Puertos y consistencia local

`CaptureServices` separa permisos, fotografía y posición; `PhotoStorage` separa
preparación y eliminación de una copia nueva; `ObservationStore` conserva el
contrato de la semana 1. Son adaptadores reemplazables para integrar M2-14 y
M2-21, no una certificación del trabajo asignado a Demian o José.

Android/iOS usa Expo ImagePicker para cámara, Expo Location en primer plano y
Expo FileSystem para copiar la imagen temporal al directorio de documentos de
la aplicación. La ruta se divide por API, propietario y UUID del borrador;
sus segmentos se codifican para impedir recorridos de ruta. Sólo se aceptan
URI locales y archivos existentes, no vacíos. Se verifica el tamaño de la copia
antes de guardar su URI en SQLite.

Si SQLite falla, se intenta retirar únicamente la copia creada en ese intento,
del mismo ámbito. Nunca se elimina el archivo original de cámara ni una foto
anterior. Una foto ya persistida del borrador se reutiliza. Las copias antiguas
tras un reemplazo correcto se conservan por ahora: la política de limpieza y
migración se debe acordar con la persistencia compartida de M2-21–22.

Web declara cámara y GPS no disponibles en este recorrido, conserva la edición
de texto en memoria y permite guardar borradores incompletos. No acredita
sensores ni persistencia móvil; el E2E usa cuentas y HTTP de demostración.

## Permisos y límites

- Cámara y ubicación se solicitan sólo por acción del usuario, nunca al entrar.
- No se solicita micrófono, biblioteca de fotos ni ubicación de fondo. El manifiesto Android bloquea explícitamente esos permisos; iOS contiene las explicaciones de cámara y posición de primer plano.
- No hay envío automático, endpoint nuevo ni declaración de medición validada.
- La recuperación tras cierre forzado mientras está abierta la cámara y la conservación de campos todavía no guardados requieren prueba en dispositivo; no se certifican con mocks.
- La comprobación física Android de cámara/GPS y permisos reales corresponde a la semana 4 (AQU-288–289). Esta entrega incluye implementación y pruebas automatizadas, no un APK instalado o ensayo con sensores reales.

## Verificación reproducible

```sh
pnpm install --frozen-lockfile
pnpm run check
pnpm run test:e2e
pnpm run doctor
pnpm run export:android
```

`check` incluye formato, lint, ambos proyectos TypeScript, Jest, SQLite real de
Node 24 y la introspección de manifiestos Android/iOS generados por Expo.
La exportación Android sólo acredita JavaScript y assets, no la compilación
de un APK ni funcionamiento del dispositivo.
