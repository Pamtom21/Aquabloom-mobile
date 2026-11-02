# Cierre de implementación de Franco — 2 de noviembre de 2026

Proyecto: **sprint 2 - movil**. Revisión de las ocho tareas que continuaban
pendientes de Franco Oyarzo. Este documento describe la evidencia técnica,
no afirma que se hayan cambiado estados en Linear si el servicio no respondió.

| Tarea                   | Resultado verificable                                                                                    | Evidencia                                              | Límite                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------- |
| AQU-275 · lista         | Fecha UTC, punto/estación, valor/unidad y estado; carga/error/vacío separados                            | `scientificScreens.test.tsx`, E2E científico           | Contrato remoto propuesto; no certifica M2-25 ni staging              |
| AQU-276 · detalle       | Escena, modelo/versión, dataset/versión, fecha y origen; datos faltantes explícitos                      | `EstimateDetail`, pruebas de trazabilidad              | Selección desde el listado del lago; no endpoint de detalle inventado |
| AQU-277 · límites       | Estado/advertencias, condición experimental, incertidumbre no informada y distinción de toxicidad        | UI y E2E con ejemplo identificado                      | Sin inferencia de agua segura ni intervalos inventados                |
| AQU-278 · trabajos      | Cola/ejecución/completado/fallo/cancelado; errores seguros y progreso sólo suministrado                  | Pruebas de API, fuentes y UI; E2E                      | Sólo lectura de trabajos existentes, sin entrenamiento                |
| AQU-290 · accesibilidad | Etiquetas, mensajes, botones de 48 px, contraste y navegación por teclado web; adaptación al teclado iOS | 5 pruebas de contraste, E2E con foco/Enter, tipos/lint | Teclado y lector físico Android aún no ensayados                      |
| AQU-291 · guía          | Recorrido de consulta/captura offline/estados, guion de demo y límites científicos                       | `guia-demostracion-sprint2-franco.md`                  | Distingue navegador, APK y dispositivos reales                        |
| AQU-288 · Android       | Implementación integrada y protocolo preparado                                                           | `verificacion-android-franco.md`                       | **No terminado:** falta dispositivo Android                           |
| AQU-289 · permisos      | Conservación/cancelación y rechazo GPS/cámara comprobados con dobles; aviso de captura incompleta        | `captureFlow.test.tsx`, pruebas de permisos            | **No terminado físicamente:** falta ensayo de diálogos Android        |

## Validación local final

Con Node 24 y pnpm 11.5.0:

- Instalación congelada: `pnpm install --frozen-lockfile`, aprobada.
- `pnpm run check`: formato, ESLint y ambos proyectos TypeScript aprobados;
  46 suites / **262 pruebas Jest**, **29 pruebas SQLite** y **2 pruebas de
  permisos nativos generados**, todas aprobadas.
- `pnpm run test:e2e`: **3 recorridos aprobados**, incluido login/retorno, ciclo
  de varios borradores y demostración científica con teclado a 390 × 844.
- Total: **296 pruebas aprobadas**.
- `pnpm run doctor`: **21/21**, sin incidencias.
- `pnpm run export:android`: Hermes **4,9 MB**, **1664 módulos**, **30 assets**.
- `git diff --check`: sin errores de espacios o marcadores de conflicto.

Hubo timeouts intermitentes de 5 segundos en el primer render de pruebas de UI
(primero la suite científica y después una prueba existente de recuperación de
observaciones). La repetición enfocada y el control completo posterior pasaron
sin modificar timeouts, desactivar casos ni relajar aserciones. No se declara
eliminada esa intermitencia de ejecución en frío.

Las capturas temporales del E2E quedan en `test-results/`, fuera del control de
versiones. Las cuentas y respuestas HTTP de esas pruebas son fixtures. Cámara,
GPS y Expo FileSystem se comprueban con dobles; SQLite y archivos del recorrido
de persistencia de Node sí usan almacenamiento temporal real.

## Fuentes, seguridad y dependencias

- Las consultas se aíslan por API, propietario, fuente e identidad. No se
  habilitan sin sesión, con UUID inválido ni con el contrato deshabilitado.
- La propuesta de Demian se conserva como propuesta; no reemplaza OpenAPI del
  backend ni se afirma que Web/API haya acordado endpoints/permisos.
- La demostración requiere una acción explícita y mantiene aviso de datos
  sintéticos en lista, detalle y trabajo. No realiza solicitudes científicas.
- Las rutas propuestas sólo se habilitan con
  `EXPO_PUBLIC_SCIENTIFIC_API_ENABLED=true` tras el acuerdo correspondiente.
- Se integró la rama de José de semanas 1–2 con merge y cuatro commits científicos
  de Demian mediante cherry-pick, conservando autores. No se cambiaron las tareas
  asignadas a ellos ni se incorporó la rama CI/CD de ejecución automática.
- No se expusieron secretos, no se iniciaron trabajos científicos ni builds
  remotos y no se ejecutaron eliminaciones contra datos reales del usuario.

## Lo que falta para declarar todo finalizado

El usuario confirmó que no dispone de Android. AQU-288 y AQU-289 no deben
marcarse como completas sólo por pasar simulaciones: requieren ejecutar la
matriz física y registrar modelo/versión/commit/resultados. La verificación
remota de ciencia depende además del contrato publicado y staging del equipo.

Al intentar registrar este cierre, Linear devolvió **Network error while
loading**. La integración directa se ofreció como alternativa, pero aún no
estaba conectada al redactar esta evidencia. GitHub y el repositorio local sí
estaban accesibles. Si continúa el fallo, quedan pendientes los comentarios y
estados manuales de Linear; no se debe afirmar que todas las tarjetas cambiaron.

Como vía adicional se enlazan los seis entregables mediante palabras de cierre
en la descripción del PR, según la [integración oficial de Linear con GitHub](https://linear.app/docs/github).
Se excluyen explícitamente las dos verificaciones físicas de esa automatización.
El merge solicita el cierre según la configuración del equipo; sin acceso a
Linear no se declara verificado el estado resultante de las tarjetas.
