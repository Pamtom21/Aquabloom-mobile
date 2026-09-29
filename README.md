# AquaBloom Mobile

Base para el [Sprint 1 móvil](https://linear.app/aquabloom/project/sprint-1-aplicacion-movil-350f4a4a4115): Demian, Jose y Franco.

La implementación y evidencia de las ocho tareas de José y Demian de la primera
semana están en [Semana 1 — José y Demian](docs/week1-jose-demian.md).

La entrega de perfil, usuario actual y cierre de sesión (AQU-25–28) está
documentada en [Autenticación](docs/jose-auth-delivery.md). El detalle de lagos
y estaciones (AQU-37–40) está en [Catálogo](docs/catalog-delivery.md), y la
persistencia móvil (AQU-49–52) en [Caché y modo sin conexión](docs/offline-delivery.md).

## Comenzar

Requisitos: Git, Node 24.3.0 (.nvmrc) y pnpm 11.5.0. Expo SDK 57 / React Native 0.86. La app usa TypeScript 6. El generador OpenAPI usa TypeScript 5.9 en tools/openapi para respetar sus dependencias sin alterar Expo. No instalar con --force.

```powershell
git clone https://github.com/Pamtom21/Aquabloom-mobile.git
cd Aquabloom-mobile
pnpm install --frozen-lockfile
pnpm run api:setup
Copy-Item .env.example .env.local
pnpm run check
pnpm run web
```

Para nuevas tareas, crear una rama desde main antes de comenzar. En macOS/Linux usar cp en vez de Copy-Item. La app arranca sin credenciales y muestra configuración pendiente. Reiniciar Expo al cambiar variables.

## Configuración pública

| Variable                             | Valor                                                                             |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| EXPO_PUBLIC_API_URL                  | URL con prefijo FastAPI, p. ej. http://10.0.2.2:8000/api/v1 para emulador Android |
| EXPO_PUBLIC_SUPABASE_URL             | URL del proyecto Supabase                                                         |
| EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Clave publishable (o anon pública heredada)                                       |

En teléfono usar URL HTTPS accesible o IP LAN del equipo; localhost apunta al teléfono. El navegador requiere CORS en FastAPI. Nunca incorporar service_role, claves privadas ni contraseñas: EXPO_PUBLIC se incluye en el paquete público.

Las URL base no deben incluir credenciales, parámetros ni fragmentos. Dejar ambas
variables Supabase vacías para arrancar sin ese servicio, o configurar las dos;
una configuración parcial muestra un error de configuración. El cliente HTTP
mantiene un límite de 15 segundos incluso en consultas cancelables.

El cliente agrega /health (AQU-59) y trata el cuerpo como unknown hasta recibir OpenAPI real. API disponible significa HTTP exitoso con JSON. Supabase se crea al configurar ambas variables. AuthProvider sincroniza el usuario actual con Supabase y el perfil muestra datos solo con sesión. El cierre afecta a la sesión actual y limpia TanStack Query. La sesión se conserva con SecureStore en Android/iOS y el refresco sigue AppState (AQU-17); web usa memoria. La ruta privada /profile redirige al login y vuelve al perfil tras autenticarse (AQU-19); el catálogo sigue siendo público; los permisos de la API deben validarse en el servidor.

## Comandos

| Comando                                           | Uso                                   |
| ------------------------------------------------- | ------------------------------------- |
| pnpm run web                                      | Navegación y estados en navegador     |
| pnpm start                                        | Servidor para development build       |
| pnpm run android                                  | Abrir development build instalado     |
| pnpm run android:build                            | Compilación local con Android SDK/JDK |
| pnpm run check                                    | Formato, lint, TypeScript y pruebas   |
| pnpm run export:android                           | Bundle JS Android; no genera APK      |
| pnpm run doctor                                   | Diagnóstico Expo                      |
| pnpm run api:generate -- ./contracts/openapi.json | Tipos desde el contrato versionado    |

## Android y EAS

La pestaña Mapa monta MapLibre con cámara inicial, carga, error y reintento (AQU-29; [validación](docs/demian-map.md)). No funciona en Expo Go: necesita development build ([MapLibre](https://maplibre.org/maplibre-react-native/docs/setup/expo/)). Compilar localmente requiere Android Studio, SDK 36, emulador/dispositivo y JDK compatible con Expo/Gradle. No se ha verificado compilación nativa ni instalación. Web ofrece acceso al catálogo.

Iniciar sesión en EAS y ejecutar `pnpm dlx eas-cli@latest init` seleccionando el proyecto del equipo para obtener projectId real. Confirmar el identificador provisional `com.aquabloom.mobile` antes de distribuir y configurar las variables públicas en EAS.

```sh
pnpm dlx eas-cli@latest build --platform android --profile development
# Instalar APK y después:
pnpm start
```

development/preview generan APK; production, AAB. No se lanzó build remoto ni se crearon claves de firma.

## Estructura y equipo

- src/app: rutas; mantener lógica de negocio en features.
- src/features: módulos por funcionalidad, con health como ejemplo.
- src/lib: HTTP, API, Supabase.
- src/providers: QueryClient, conectividad y foco.
- src/components y src/theme: componentes y tokens.
- scripts y contracts: generación OpenAPI.
- docs/linear-sprint.md: 48 tareas, responsables y dependencias.

Un PR por unidad revisable, enlazar Linear y añadir evidencia local. Ejecutar
`pnpm run check` y `pnpm run export:android` en el equipo. Mobile CI queda
exclusivamente manual (`workflow_dispatch`): no se ejecuta al enviar commits
ni abrir PR en esta rama. No se requiere GitHub Actions ni contratar un plan
para validar los cambios. No se han modificado las reglas de protección del
repositorio; la configuración manual se aplica a otras ramas cuando integren
este cambio.

## Integraciones pendientes

El contrato móvil de lectura está versionado en `contracts/openapi.json`,
contrastado con el código de referencia del backend y genera los tipos del
catálogo, detalle y estaciones. La referencia se consultó sin modificarla.
Falta comprobar una instancia desplegada y completar los mapas.

SQLite conserva el catálogo público en Android/iOS durante 24 horas, separado
por API, usuario y consulta. El cierre de sesión y los cambios de identidad
limpian la caché. Web sigue sin persistencia SQLite. Los endpoints actuales no
tienen contexto de organización; los datos privados necesitarán un alcance
específico antes de almacenarse. No se guardan perfiles ni tokens.

Mapas, E2E con cuentas reales y verificación en dispositivo siguen
pendientes. Las pruebas de autenticación integran el SDK real de Supabase con
HTTP simulado; no certifican el servicio remoto.

## Referencias

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- [Supabase React Native](https://supabase.com/docs/guides/auth/quickstarts/react-native)
- [MapLibre Expo](https://maplibre.org/maplibre-react-native/docs/setup/expo/)
