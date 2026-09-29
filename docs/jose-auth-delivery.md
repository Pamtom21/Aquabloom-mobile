# Entrega de autenticación — José Jiménez

Fecha: 27 de septiembre de 2026.

Este informe registra la entrega de autenticación. Las tareas que al redactarlo
quedaron pendientes se implementan después en [Catálogo](catalog-delivery.md)
y [Caché y modo sin conexión](offline-delivery.md). La limpieza de caché de la
última rama también incluye SQLite.

Repositorio: [Pamtom21/Aquabloom-mobile](https://github.com/Pamtom21/Aquabloom-mobile).
Base: `695c2eb` de `main`. Rama local: `feat/jose-auth-profile`.

## Resultado y alcance

Se implementaron y probaron AQU-25, AQU-26, AQU-27 y AQU-28 como un bloque
funcional completo sobre la sesión en memoria que ya usa el repositorio.
Las cuatro tareas de la primera semana ya tenían implementación en main.
Se verificaron sus comprobaciones y se corrigieron problemas de instalación
y compatibilidad que impedían reproducirlas en este clon.

Esta entrega no modifica estados de Linear. La aceptación de las tareas exige
revisión del PR por el equipo e integración con servicios reales; los commits
locales y las pruebas automatizadas no sustituyen esos pasos.

| Tarea                                               | Resultado                                                                                                |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [AQU-13](https://linear.app/aquabloom/issue/AQU-13) | ESLint y Prettier existentes verificados; finales LF reproducibles en Windows.                           |
| [AQU-14](https://linear.app/aquabloom/issue/AQU-14) | Se conserva y utiliza la estructura existente: rutas, features, providers y componentes.                 |
| [AQU-15](https://linear.app/aquabloom/issue/AQU-15) | Implementación existente de health y sus pruebas pasan; no se verificó una API remota.                   |
| [AQU-16](https://linear.app/aquabloom/issue/AQU-16) | Se corrigieron dependencias y configuración para ejecutar las comprobaciones de CI localmente.           |
| [AQU-25](https://linear.app/aquabloom/issue/AQU-25) | Cierre de la sesión actual, cancelación y limpieza de TanStack Query, errores recuperables.              |
| [AQU-26](https://linear.app/aquabloom/issue/AQU-26) | Hook del usuario actual, carga inicial, eventos de sesión, reintento y aislamiento al cambiar de cuenta. |
| [AQU-27](https://linear.app/aquabloom/issue/AQU-27) | Perfil con datos reales disponibles, acceso anónimo, configuración ausente y cierre de sesión.           |
| [AQU-28](https://linear.app/aquabloom/issue/AQU-28) | Integración de login, cliente Supabase real, eventos, perfil y logout con HTTP simulado.                 |

## Commits funcionales

| Commit    | Qué se hizo                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------- |
| `b84283c` | Declara los tipos de Node requeridos por TypeScript, fija LF y resuelve la política del script opcional de unrs-resolver. |
| `2740456` | Integra AuthProvider y useCurrentUser; evita lecturas iniciales obsoletas y datos de otra cuenta.                         |
| `f70e3a2` | Implementa cierre con scope local y limpieza de consultas/mutaciones, incluyendo respuestas tardías y errores.            |
| `1841fbe` | Sustituye el marcador del perfil y prueba sus estados y el reintento del cierre.                                          |
| `f893585` | Añade integración con el SDK real de Supabase y una regresión para las consultas públicas sin configuración de auth.      |

Un commit adicional alinea los parches de Expo SDK 57 y unifica Metro Runtime.
Los mensajes de cada commit incluyen su alcance y la validación realizada.
Consultar `git log --format=fuller main..HEAD` para los detalles completos.

## Comportamiento de sesión y caché

- El perfil usa el nombre disponible en los metadatos, correo y teléfono; no
  muestra tokens ni deduce roles.
- Durante la carga de sesión y el cierre se desmontan las pantallas, evitando
  consultas nuevas con una identidad en transición.
- Al cambiar de usuario o recibir SIGNED_OUT se limpian las consultas y se
  reinicia el estado local de las pantallas.
- Un refresco del mismo usuario conserva su caché.
- El cierre afecta solo a la sesión actual. Si Supabase devuelve un error,
  la sesión se conserva y el usuario puede reintentar.
- La caché actual es TanStack Query en memoria. No existe persistencia SQLite
  habilitada en esta rama. Su futura limpieza debe integrarse antes de activarla.
- Se conservan las sesiones en memoria del proyecto; no se presenta esta entrega
  como implementación de SecureStore, refresh por AppState ni protección general
  de rutas de AQU-17–19. El perfil controla su propio acceso y la API debe aplicar
  autorización en el servidor.

## Verificación

Entorno: Windows, Node 24.19.0 y pnpm 11.5.0. No se usaron credenciales reales.

| Comprobación                     | Resultado                                                           |
| -------------------------------- | ------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile` | Aprobada.                                                           |
| `pnpm run check`                 | Prettier, ESLint, TypeScript y Jest aprobados.                      |
| Jest                             | 17 suites, 71 pruebas; 20 pruebas nuevas de autenticación.          |
| `pnpm peers check`               | Sin conflictos de dependencias pares.                               |
| `pnpm exec expo install --check` | Dependencias alineadas al SDK instalado.                            |
| `pnpm run export:android`        | Bundle JavaScript Android generado; no equivale a un APK instalado. |

Las pruebas cubren éxito y rechazo de login, cambio de cuenta, actualización del
usuario, lectura inicial tardía, suscripciones, consulta pública sin Supabase,
cancelación de solicitudes, resultados tardíos, cierre externo, campos ausentes
y reintento del cierre fallido. El cliente real de Supabase se ejercita con un
transporte HTTP simulado; la suite no certifica una instancia remota.

No se verificó instalación en dispositivo Android ni comportamiento con
credenciales reales. La revisión humana y los Checks remotos de un PR también
quedan fuera de la evidencia local.

## Tareas que no se iniciaron

| Tareas                         | Motivo y siguiente bloque completo                                                                                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AQU-37, AQU-38, AQU-39, AQU-40 | El contrato versionado solo define GET /lakes. Falta acordar detalle de lago, estaciones, paginación y destinos de estación antes de implementar sus hooks y navegación sin inventar endpoints.         |
| AQU-49, AQU-50, AQU-51, AQU-52 | Se reservan para una entrega completa de offline: sesión persistente, alcance por usuario/organización, esquema SQLite, TTL, limpieza al salir, fallback sin ocultar 401/403 y pruebas de persistencia. |

No se agregaron stubs ni botones de negocio sin implementación para estas ocho
tareas. Los marcadores que ya existían en main continúan identificados como
pendientes.

## Verificación manual con un entorno del equipo

1. Configurar las variables públicas descritas en `.env.example` en un archivo
   local excluido de Git.
2. Abrir Perfil e iniciar sesión con una cuenta de prueba.
3. Confirmar que se muestran sus datos y que nunca aparecen tokens.
4. Cerrar sesión y confirmar que desaparecen los datos del perfil.
5. Iniciar sesión con otra cuenta y comprobar que no se conserva información
   anterior.
6. Interrumpir la conectividad al cerrar sesión: debe mostrarse el error y
   permitir reintentar al recuperar conexión.
