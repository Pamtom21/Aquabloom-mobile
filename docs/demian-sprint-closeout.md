# AQU-44 — Evidencia y lista de cierre de Demian

Actualizado: 30-09-2026. Rama `demian/sprint-1`, basada en `4ba0404` de main.
Cada tarea implementada tiene su propio commit. Esta lista distingue código
validado localmente de aceptación final; no certifica un cierre total del sprint.

| Fecha límite | Tareas         | Evidencia                                                               | Pendiente                                                       |
| ------------ | -------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| 09-09        | AQU-5, 6, 7, 8 | [Entrega semana 1](week1-jose-demian.md), implementación previa en main | Servicios desplegados                                           |
| 16-09        | AQU-18, 20     | [Autenticación existente](jose-auth-delivery.md), SDK y cliente HTTP    | Verificación remota                                             |
| 16-09        | AQU-17         | `3bfa0ad`, [persistencia](demian-session.md)                            | SecureStore en dispositivo                                      |
| 16-09        | AQU-19         | `deab861`, [rutas privadas](demian-routes.md)                           | Revisión del PR                                                 |
| 23-09        | AQU-29         | `d619e25`, [mapa base](demian-map.md)                                   | Renderizado Android                                             |
| 23-09        | AQU-30         | `518c1b6`, [polígonos](demian-map.md)                                   | Geometrías de API real en Android                               |
| 23-09        | AQU-31         | `ab0fcdc`, [estaciones](demian-map.md)                                  | Marcadores en Android                                           |
| 23-09        | AQU-32         | `7120b3a`, [ficha inferior](demian-map.md)                              | Gestos y disposición en Android                                 |
| 30-09        | AQU-41         | `cff116d`, [E2E ejecutada](../e2e/README.md)                            | Revisión del PR; servicios reales fuera del alcance del fixture |
| 30-09        | AQU-42         | `3884aa1`, [perfiles EAS](demian-android.md)                            | Proyecto vinculado; revisión del PR pendiente                   |
| 30-09        | AQU-43         | [APK generado con EAS](demian-android.md)                               | Instalación en Android pendiente                                |
| 30-09        | AQU-44         | Este documento                                                          | Adjuntar evidencia nativa y aprobación cuando existan           |

## Validaciones realizadas

- [x] `pnpm run check`: formato, ESLint, TypeScript de app/E2E, 115 pruebas Jest
      en 26 suites y 15 pruebas de caché SQLite aprobadas.
- [x] `pnpm run test:e2e`: 1 recorrido Chromium aprobado. Usa rutas, formularios,
      SDK y clientes reales; simula respuestas HTTP con datos de prueba.
- [x] `pnpm run export:android`: bundle de 1.599 módulos generado correctamente.
- [x] EAS CLI 24.8.0: resolución local de development, preview y production con
      versiones de herramientas, entorno, distribución y artefacto correctos.
- [x] `git diff --check` sin errores; artefactos, trazas, .env y claves excluidos.
- [x] Proyecto EAS real vinculado a la cuenta autorizada deimon005.
- [ ] Variables públicas de servicios configuradas para pruebas con datos reales.
- [x] APK generado y URL/ID del build registrados.
- [ ] Instalación y pruebas en dispositivo o emulador documentadas.
- [ ] Revisión y aprobación del PR antes de integrar en main.

Una ejecución simultánea de Jest y la preparación del navegador excedió el
timeout de una prueba. La repetición de la suite completa pasó sin cambiar el
timeout. El primer E2E detectó un selector ambiguo entre una pantalla oculta y
la visible; se corrigió el selector y el recorrido completo pasó.

## Evidencia pendiente de AQU-43

EAS terminó correctamente el build preview
`74b7edf7-dbb1-473e-90af-b6867b152372` y publicó un APK de 149.898.955 bytes.
No hay SDK/adb en el equipo y todavía no existe evidencia de instalación, por lo
que AQU-43 no se debe marcar como Done. Registrar el dispositivo, la versión
Android, el resultado de cada recorrido y capturas reales al completarlo.

La revisión nativa debe cubrir persistencia de sesión al reiniciar, logout y
limpieza, redirección del perfil, catálogo, detalle, mapa, polígonos, marcadores,
ficha inferior, atribución visible y recuperación de red.

## Evidencia del resto del sprint

Las entregas previas de otros integrantes están documentadas en
[autenticación/perfil](jose-auth-delivery.md), [detalle y estaciones](catalog-delivery.md)
y [caché sin conexión](offline-delivery.md). No se modificaron sus ramas ni se
dan por completadas pruebas remotas o revisiones que no consten en la evidencia.
Linear conserva el estado operativo; este documento conserva el resultado de
la entrega local y sus limitaciones.
