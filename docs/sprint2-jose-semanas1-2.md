# Sprint 2 móvil — Jose Jimenez — semanas 1 y 2

Alcance: tareas asignadas a Jose Jimenez hasta el 18 de octubre de 2026.
Comprende AQU-255–258 y AQU-267–270. Las semanas 3 y 4 quedan fuera de esta entrega.

| Tarea                                                 | Resultado                                                                                                                                                                          | Evidencia                                                                                                  |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [AQU-255](https://linear.app/aquabloom/issue/AQU-255) | Migración transaccional v1 → v2 con UUID, propietario, lago, fecha UTC, coordenadas, precisión, nota, foto y estado local. Conserva los registros y el catálogo.                   | `scripts/observation-store.test.mjs`: migración, rollback y rechazo de versiones futuras.                  |
| [AQU-256](https://linear.app/aquabloom/issue/AQU-256) | Guardado por UUID mediante upsert; guardar de nuevo actualiza el mismo registro.                                                                                                   | SQLite real, prueba de UUID y edición desde UI/E2E.                                                        |
| [AQU-257](https://linear.app/aquabloom/issue/AQU-257) | Lectura, listado y eliminación separados por API y propietario. La sesión desmonta el editor al cambiar de identidad; salir conserva los pendientes en disco.                      | Pruebas de SQLite, cambio de cuenta en `ObservationScreen.test.tsx` y pruebas existentes de autenticación. |
| [AQU-258](https://linear.app/aquabloom/issue/AQU-258) | Recuperación tras cerrar y reabrir la conexión SQLite, sin exponer registros de otro usuario.                                                                                      | Archivo SQLite temporal real y comparación de todos los campos recuperados.                                |
| [AQU-267](https://linear.app/aquabloom/issue/AQU-267) | Copia de foto a documentos antes de guardar SQLite; rutas por API/usuario/UUID y rollback de copias nuevas si falla el guardado.                                                   | `nativePhotoStorage.test.ts`, `saveObservation.test.ts` y recorrido SQLite con archivos reales.            |
| [AQU-268](https://linear.app/aquabloom/issue/AQU-268) | Listado y selección de borradores, edición con el mismo UUID y creación de uno nuevo. Eliminar requiere confirmación y retira todas las fotos administradas del UUID seleccionado. | UI, E2E, `deleteObservation.test.ts` y eliminación aislada en SQLite/FileSystem.                           |
| [AQU-269](https://linear.app/aquabloom/issue/AQU-269) | Recupera borradores propios aun sin catálogo disponible. Una foto faltante muestra una incidencia y permite reemplazarla sin perder la nota.                                       | `ObservationScreen.test.tsx`, SQLite tras reinicio y prueba de vista previa fallida.                       |
| [AQU-270](https://linear.app/aquabloom/issue/AQU-270) | Observación con foto, fecha, nota y ubicación guardada localmente, recuperada tras reinicio con estado `pending_send` y sin duplicación.                                           | Recorrido con SQLite y archivos reales; E2E de múltiples borradores de texto sin escrituras remotas.       |

## Persistencia y recuperación

Se amplía el adaptador existente de observaciones, sin reemplazar el trabajo previo
de captura. La base `aquabloom-observation-form-v1.db` mantiene su nombre para
recuperar las instalaciones existentes. `PRAGMA user_version` pasa a 2 y se agregan
columnas consultables al modelo; el JSON original se conserva para no perder
campos ni compatibilidad con el formulario. Un error de migración revierte todo
el cambio y mantiene el borrador original.

La base de catálogo `aquabloom-catalog-v1.db` permanece separada. El cierre de
sesión limpia la caché de consultas existente y desmonta los formularios, pero
no elimina borradores ni fotografías. La cuenta original puede recuperarlos al
volver a autenticarse. El listado y las lecturas comprueban que el propietario,
la API, el lago y el UUID del JSON coincidan con su fila.

Las fotografías se copian al directorio de documentos de la aplicación, en una
carpeta exclusiva por API, propietario y UUID. Eliminar un borrador retira su
carpeta completa, incluidas fotografías reemplazadas, sin tocar la fuente de
cámara ni otros borradores. Si falla FileSystem, se conserva la fila para
reintentar. Si FileSystem termina pero falla SQLite, se informa el fallo y se
conserva la fila con sus campos: permite reintentar la eliminación o reemplazar
la fotografía ausente. No se declara atomicidad entre SQLite y el sistema de
archivos.

## Comprobación manual en Android/iOS

1. Iniciar sesión, abrir un lago y entrar a Observaciones de terreno.
2. Capturar una foto y ubicación, completar fecha/nota, desconectar la red y guardar.
3. Cerrar y reabrir la app. Recuperar los campos y la foto desde el mismo lago.
4. Editar la nota y guardar: el UUID se mantiene. Crear otro borrador y alternar
   entre ambos mediante **Ver borradores guardados**.
5. Salir y entrar con otra cuenta: no aparecen los borradores ni sus fotos.
   Volver a la cuenta original y comprobar los pendientes.
6. Eliminar un borrador, cancelar primero la confirmación y luego confirmarla.
   Comprobar que desaparece su registro y su carpeta, conservando el otro.
7. Con una fotografía faltante, comprobar la incidencia y usar **Reemplazar fotografía**.

Las pruebas automatizadas de Node cierran y reabren conexiones a SQLite real;
el recorrido de archivos comprueba copia, recuperación y eliminación en disco.
Los adaptadores nativos de Expo se verifican con dobles de FileSystem y sensores.
Web conserva borradores sólo durante la sesión y no acredita persistencia móvil.
La instalación de APK, el reinicio físico del teléfono, la cámara/GPS reales y
staging corresponden a las tareas posteriores y no se certifican aquí.

## Validación reproducible

```sh
pnpm install --frozen-lockfile
pnpm run check
pnpm run test:e2e
pnpm run doctor
pnpm run export:android
git diff --check
```

El bundle Android acredita empaquetado JavaScript y assets, no un APK instalado.

Resultado del 23 de octubre de 2026, Node 24.3.0 y pnpm 11.5.0:

- Instalación con `--frozen-lockfile`: aprobada.
- `pnpm run check`: formato, ESLint, ambos proyectos TypeScript, 40 suites / 203
  pruebas Jest, 29 pruebas de SQLite y 2 comprobaciones de permisos aprobadas.
- `pnpm run test:e2e`: 2 recorridos aprobados en Chromium con viewport móvil,
  incluyendo recuperación, edición, selección y eliminación de varios borradores.
- `pnpm run doctor`: 21 de 21 comprobaciones aprobadas.
- `pnpm run export:android`: 1650 módulos, 30 assets y bundle Hermes de 4,8 MB.
- `git diff --check`: aprobado.

Total: 236 pruebas aprobadas. Una ejecución anterior de la prueba existente de
autenticación agotó sus 5 segundos mientras se ejecutaban otras verificaciones.
El control completo repetido sin los bundles en paralelo pasó sin modificar
el límite ni omitir pruebas.

Se alinearon seis parches compatibles del SDK 57 para aprobar la comprobación
de dependencias. El override de `@expo/metro-runtime` en `pnpm-workspace.yaml`
también debe coincidir con la dependencia directa antes de regenerar el lockfile;
mantener el valor anterior hace fallar la instalación congelada de pnpm 11.5.0.
