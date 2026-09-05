# Plan del sprint móvil

Consulta Linear: 2026-09-05. Las 48 tareas estaban en Backlog. Linear sigue siendo la fuente de estado; no se cerraron tareas automáticamente.

## Orden de integración

1. Revisar base y CI (AQU-5–16), validar health con API real.
2. Demian: SecureStore/AuthProvider/protección; Franco: login; Jose: perfil y limpieza de caché. Las rutas actuales son públicas y solo muestran preparación: protegerlas antes de introducir datos privados.
3. Obtener OpenAPI real (AQU-33), implementar hooks/pantallas/mapa. MapLibre requiere development build.
4. SQLite por usuario/organización, TTL y limpieza al salir; pruebas offline, E2E, accesibilidad y build Android.

## Base y pendientes

Disponibles: Expo/TypeScript, Router/pestañas, Screen/tokens/estados, HTTP, Supabase en memoria, health, QueryClient, herramientas de pruebas, generador OpenAPI, CI y perfiles EAS. Las pantallas de negocio son pendientes explícitos. Las tareas requieren revisión y evidencia antes de cerrarse.

Pendientes externos: URL FastAPI con prefijo /api/v1, contrato OpenAPI, URL/clave pública Supabase, cuenta de prueba y roles, estilo de mapa/atribución, cuenta/proyecto EAS y dispositivo Android. No se encontraron esos datos en el repositorio vacío ni documentos del proyecto.

## Demian Quezada

| Tarea                                                                                                  | Trabajo                                            | Estado de preparación                              |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | -------------------------------------------------- |
| [AQU-5](https://linear.app/aquabloom/issue/AQU-5/inicializar-expo-typescript)                          | Inicializar Expo TypeScript                        | Base disponible; revisar aceptación e integración  |
| [AQU-6](https://linear.app/aquabloom/issue/AQU-6/configurar-variables-publicas)                        | Configurar variables públicas                      | Base disponible; revisar aceptación e integración  |
| [AQU-7](https://linear.app/aquabloom/issue/AQU-7/configurar-cliente-supabase)                          | Configurar cliente Supabase                        | Base disponible; revisar aceptación e integración  |
| [AQU-8](https://linear.app/aquabloom/issue/AQU-8/crear-cliente-http-tipado)                            | Crear cliente HTTP tipado                          | Base disponible; revisar aceptación e integración  |
| [AQU-17](https://linear.app/aquabloom/issue/AQU-17/implementar-persistencia-de-sesion-con-securestore) | Implementar persistencia de sesión con SecureStore | Herramientas disponibles; implementación pendiente |
| [AQU-18](https://linear.app/aquabloom/issue/AQU-18/crear-authprovider)                                 | Crear AuthProvider                                 | Herramientas disponibles; implementación pendiente |
| [AQU-19](https://linear.app/aquabloom/issue/AQU-19/proteger-rutas-privadas)                            | Proteger rutas privadas                            | Herramientas disponibles; implementación pendiente |
| [AQU-20](https://linear.app/aquabloom/issue/AQU-20/adjuntar-token-supabase-al-cliente-http)            | Adjuntar token Supabase al cliente HTTP            | Herramientas disponibles; implementación pendiente |
| [AQU-29](https://linear.app/aquabloom/issue/AQU-29/configurar-maplibre)                                | Configurar MapLibre                                | Herramientas disponibles; implementación pendiente |
| [AQU-30](https://linear.app/aquabloom/issue/AQU-30/crear-poligonos-geojson-de-lagos)                   | Crear polígonos GeoJSON de lagos                   | Herramientas disponibles; implementación pendiente |
| [AQU-31](https://linear.app/aquabloom/issue/AQU-31/crear-marcadores-de-estaciones)                     | Crear marcadores de estaciones                     | Herramientas disponibles; implementación pendiente |
| [AQU-32](https://linear.app/aquabloom/issue/AQU-32/crear-ficha-inferior-de-mapa)                       | Crear ficha inferior de mapa                       | Herramientas disponibles; implementación pendiente |
| [AQU-41](https://linear.app/aquabloom/issue/AQU-41/crear-prueba-end-to-end-de-login-a-detalle)         | Crear prueba end-to-end de login a detalle         | Herramientas disponibles; implementación pendiente |
| [AQU-42](https://linear.app/aquabloom/issue/AQU-42/configurar-eas-build-android)                       | Configurar EAS Build Android                       | Herramientas disponibles; implementación pendiente |
| [AQU-43](https://linear.app/aquabloom/issue/AQU-43/generar-e-instalar-build-de-prueba)                 | Generar e instalar build de prueba                 | Herramientas disponibles; implementación pendiente |
| [AQU-44](https://linear.app/aquabloom/issue/AQU-44/crear-lista-de-cierre-y-evidencia-del-sprint)       | Crear lista de cierre y evidencia del sprint       | Herramientas disponibles; implementación pendiente |

## Jose Jimenez

| Tarea                                                                                                | Trabajo                                          | Estado de preparación                              |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------- |
| [AQU-13](https://linear.app/aquabloom/issue/AQU-13/configurar-eslint-y-prettier)                     | Configurar ESLint y Prettier                     | Base disponible; revisar aceptación e integración  |
| [AQU-14](https://linear.app/aquabloom/issue/AQU-14/crear-estructura-de-carpetas)                     | Crear estructura de carpetas                     | Base disponible; revisar aceptación e integración  |
| [AQU-15](https://linear.app/aquabloom/issue/AQU-15/consultar-endpoint-health)                        | Consultar endpoint health                        | Base disponible; revisar aceptación e integración  |
| [AQU-16](https://linear.app/aquabloom/issue/AQU-16/configurar-ci-en-pull-requests)                   | Configurar CI en pull requests                   | Base disponible; revisar aceptación e integración  |
| [AQU-25](https://linear.app/aquabloom/issue/AQU-25/implementar-cierre-de-sesion-y-limpieza-de-cache) | Implementar cierre de sesión y limpieza de caché | Herramientas disponibles; implementación pendiente |
| [AQU-26](https://linear.app/aquabloom/issue/AQU-26/crear-hook-del-usuario-actual)                    | Crear hook del usuario actual                    | Herramientas disponibles; implementación pendiente |
| [AQU-27](https://linear.app/aquabloom/issue/AQU-27/crear-pantalla-de-perfil)                         | Crear pantalla de perfil                         | Herramientas disponibles; implementación pendiente |
| [AQU-28](https://linear.app/aquabloom/issue/AQU-28/crear-pruebas-de-integracion-de-autenticacion)    | Crear pruebas de integración de autenticación    | Herramientas disponibles; implementación pendiente |
| [AQU-37](https://linear.app/aquabloom/issue/AQU-37/crear-hook-uselakedetail)                         | Crear hook useLakeDetail                         | Herramientas disponibles; implementación pendiente |
| [AQU-38](https://linear.app/aquabloom/issue/AQU-38/crear-hook-usestations)                           | Crear hook useStations                           | Herramientas disponibles; implementación pendiente |
| [AQU-39](https://linear.app/aquabloom/issue/AQU-39/crear-pantalla-de-detalle-de-lago)                | Crear pantalla de detalle de lago                | Herramientas disponibles; implementación pendiente |
| [AQU-40](https://linear.app/aquabloom/issue/AQU-40/crear-lista-de-estaciones-y-navegacion-comun)     | Crear lista de estaciones y navegación común     | Herramientas disponibles; implementación pendiente |
| [AQU-49](https://linear.app/aquabloom/issue/AQU-49/crear-esquema-de-cache-expo-sqlite)               | Crear esquema de caché Expo SQLite               | Herramientas disponibles; implementación pendiente |
| [AQU-50](https://linear.app/aquabloom/issue/AQU-50/persistir-respuestas-en-sqlite)                   | Persistir respuestas en SQLite                   | Herramientas disponibles; implementación pendiente |
| [AQU-51](https://linear.app/aquabloom/issue/AQU-51/crear-fallback-offline-desde-sqlite)              | Crear fallback offline desde SQLite              | Herramientas disponibles; implementación pendiente |
| [AQU-52](https://linear.app/aquabloom/issue/AQU-52/crear-pruebas-de-cache-offline)                   | Crear pruebas de caché offline                   | Herramientas disponibles; implementación pendiente |

## Franco Oyarzo

| Tarea                                                                                                  | Trabajo                                             | Estado de preparación                              |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | -------------------------------------------------- |
| [AQU-9](https://linear.app/aquabloom/issue/AQU-9/configurar-expo-router-y-rutas)                       | Configurar Expo Router y rutas                      | Base disponible; revisar aceptación e integración  |
| [AQU-10](https://linear.app/aquabloom/issue/AQU-10/navegacion-por-pestanas)                            | Navegación por pestañas                             | Base disponible; revisar aceptación e integración  |
| [AQU-11](https://linear.app/aquabloom/issue/AQU-11/crear-tokens-de-diseno-y-componente-screen)         | Crear tokens de diseño y componente Screen          | Base disponible; revisar aceptación e integración  |
| [AQU-12](https://linear.app/aquabloom/issue/AQU-12/crear-estados-reutilizables-de-carga-error-y-vacio) | Crear estados reutilizables de carga, error y vacío | Base disponible; revisar aceptación e integración  |
| [AQU-21](https://linear.app/aquabloom/issue/AQU-21/crear-formulario-de-login-validado)                 | Crear formulario de login validado                  | Herramientas disponibles; implementación pendiente |
| [AQU-22](https://linear.app/aquabloom/issue/AQU-22/conectar-login-a-supabase)                          | Conectar login a Supabase                           | Herramientas disponibles; implementación pendiente |
| [AQU-23](https://linear.app/aquabloom/issue/AQU-23/crear-mensajes-de-error-de-autenticacion)           | Crear mensajes de error de autenticación            | Herramientas disponibles; implementación pendiente |
| [AQU-24](https://linear.app/aquabloom/issue/AQU-24/crear-pruebas-del-formulario-de-login)              | Crear pruebas del formulario de login               | Herramientas disponibles; implementación pendiente |
| [AQU-33](https://linear.app/aquabloom/issue/AQU-33/generar-tipos-desde-openapi)                        | Generar tipos desde OpenAPI                         | Herramientas disponibles; implementación pendiente |
| [AQU-34](https://linear.app/aquabloom/issue/AQU-34/configurar-queryclient)                             | Configurar QueryClient                              | Herramientas disponibles; implementación pendiente |
| [AQU-35](https://linear.app/aquabloom/issue/AQU-35/crear-hook-uselakes-con-filtros)                    | Crear hook useLakes con filtros                     | Herramientas disponibles; implementación pendiente |
| [AQU-36](https://linear.app/aquabloom/issue/AQU-36/crear-pantalla-de-catalogo)                         | Crear pantalla de catálogo                          | Herramientas disponibles; implementación pendiente |
| [AQU-45](https://linear.app/aquabloom/issue/AQU-45/implementar-mejoras-de-accesibilidad)               | Implementar mejoras de accesibilidad                | Herramientas disponibles; implementación pendiente |
| [AQU-46](https://linear.app/aquabloom/issue/AQU-46/implementar-diseno-responsive-movil)                | Implementar diseño responsive móvil                 | Herramientas disponibles; implementación pendiente |
| [AQU-47](https://linear.app/aquabloom/issue/AQU-47/crear-banner-global-de-conectividad)                | Crear banner global de conectividad                 | Herramientas disponibles; implementación pendiente |
| [AQU-48](https://linear.app/aquabloom/issue/AQU-48/crear-readme-reproducible)                          | Crear README reproducible                           | Herramientas disponibles; implementación pendiente |
