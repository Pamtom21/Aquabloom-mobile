# Sprint 2 móvil — Semana 1 de Franco

Entrega del 7 de octubre de 2026 para **sprint 2 - movil**, hito
**Semana 1 — Contratos y borradores (1–7 de octubre)**.

| Issue                                                                                                   | Aceptación implementada                                                                                            | Evidencia                                                                    |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| [AQU-251](https://linear.app/aquabloom/issue/AQU-251/m2-05-anadir-acceso-a-observaciones-desde-el-lago) | Desde el detalle se abre una observación del mismo lago; login conserva el destino interno.                        | `detailFlow.test.tsx`, `RequireSession.test.tsx`, `e2e/observations.spec.ts` |
| [AQU-252](https://linear.app/aquabloom/issue/AQU-252/m2-06-crear-formulario-minimo-de-observacion)      | Lago seleccionado, fecha/hora local y nota; ubicación y foto reservadas.                                           | `ObservationForm.test.tsx`, E2E en 390 × 844                                 |
| [AQU-253](https://linear.app/aquabloom/issue/AQU-253/m2-07-validar-los-datos-del-borrador)              | Calendario real, conversión UTC, nota acotada y coordenadas finitas en rango; completar requiere ubicación y foto. | `observationSchema.test.ts`                                                  |
| [AQU-254](https://linear.app/aquabloom/issue/AQU-254/m2-08-mostrar-estados-locales-del-borrador)        | Edición, guardando y guardado local; registro pendiente de envío y no validado.                                    | `ObservationForm.test.tsx`, `ObservationScreen.test.tsx`, SQLite real        |

## Recorrido reproducible

1. Instalar con `pnpm install --frozen-lockfile` y configurar el entorno público.
2. Abrir un lago en Catálogo y pulsar **Observaciones de terreno**.
3. Iniciar sesión si se solicita. Se vuelve a la observación del mismo lago.
4. Escribir fecha/hora `AAAA-MM-DD HH:mm` y una nota opcional de hasta 2000 caracteres.
5. Guardar el borrador. La confirmación sólo aparece después de resolver el almacenamiento.
6. Volver al lago y abrir Observaciones: se recupera el último borrador de esa cuenta, API y lago.
7. Modificar la nota: vuelve a **En edición**, conserva el último respaldo y actualiza el mismo UUID al guardar.

Un calendario imposible no guarda. Un fallo de disco conserva los campos editados
y permite reintentar. Un fallo al recuperar un registro bloquea la edición para
evitar sobrescribirlo. Cambiar de cuenta retira el formulario anterior mientras
se recupera el contexto de la nueva cuenta.

## Contrato de integración local

El formulario depende de `ObservationStore` (`save`, `latest`, `durability`).
Android/iOS usa el adaptador de `aquabloom-observation-form-v1.db`, con la tabla
`observation_form_drafts`; el caché del catálogo y su migración quedan separados.
El registro versionado conserva UUID local, propietario, entorno API, lago,
fecha/hora UTC, nota, ubicación y foto opcionales, momento de guardado y
`pending_send`. Las consultas y escrituras usan parámetros SQL.

Este adaptador respalda el flujo de interfaz hasta integrar la persistencia
compartida de José (M2-09–12). Su entrega podrá sustituir el puerto y acordar una
migración de los registros de esta base. No se da por completado ese trabajo.
Cerrar sesión retira el acceso visual y conserva el respaldo local para su
propietario; no se incorpora a la limpieza del caché público.

Web usa memoria de la sesión de aplicación y lo declara en pantalla. Recargar el
navegador pierde esos borradores; no acredita persistencia nativa. El E2E usa
cuentas y respuestas HTTP de demostración, identificadas en la prueba.

## Límites de esta semana

- Ubicación y fotografía se habilitan en la semana 2 (M2-13–24).
- Un borrador incompleto puede guardarse, pero **Finalizar observación** permanece deshabilitado.
- El esquema de captura completa rechaza lago/fecha inválidos, ubicación ausente o fuera de rango y fotografía ausente.
- No existe envío automático ni endpoint de sincronización acordado; se conserva `pending_send`.
- Una observación o fotografía de terreno no constituye una medición validada.
- La comprobación en dispositivo Android, permisos reales y captura completa corresponden a entregas posteriores.

## Comprobación local

```sh
pnpm run check
pnpm run test:e2e
pnpm run doctor
pnpm run export:android
```

`check` incluye pruebas de UI y esquema, además de las pruebas de caché y
borradores ejecutadas contra el motor SQLite real de Node 24. `test:e2e` requiere
`pnpm exec playwright install chromium` la primera vez. El test del formulario
genera `observation-saved.png` en `test-results/` como evidencia visual temporal.
La exportación Android acredita el bundle, no un APK instalado.

Esta integración también incorpora los commits previos de AQU-45–48 que seguían
en `franco` y sincroniza los avances de sesión, mapa y E2E de `main` mediante
merge normal, conservando cada commit.
