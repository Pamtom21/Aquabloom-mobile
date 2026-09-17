# AquaBloom Mobile

Base para el [Sprint 1 móvil](https://linear.app/aquabloom/project/sprint-1-aplicacion-movil-350f4a4a4115): Demian, Jose y Franco.

La implementación y evidencia de las ocho tareas de José y Demian de la primera
semana están en [Semana 1 — José y Demian](docs/week1-jose-demian.md).

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

El cliente agrega /health (AQU-59) y trata el cuerpo como unknown hasta recibir OpenAPI real. API disponible significa HTTP exitoso con JSON. Supabase se crea al configurar ambas variables. La sesión permanece en memoria: SecureStore, refresh, AuthProvider y protección siguen pendientes en AQU-17–19. Las rutas iniciales no contienen datos privados.

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

MapLibre está instalado con plugin; el mapa se implementa en AQU-29–32. No funciona en Expo Go: necesita development build ([MapLibre](https://maplibre.org/maplibre-react-native/docs/setup/expo/)). Compilar localmente requiere Android Studio, SDK 36, emulador/dispositivo y JDK compatible con Expo/Gradle. En este equipo se detectó Java 21; no adb ni ANDROID_HOME. No se ha verificado compilación nativa ni instalación.

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

Rama sugerida: feat/aqu-17-secure-session. Un PR por unidad revisable, enlazar Linear, añadir evidencia y pedir revisión de otro integrante. CI ejecuta check, compatibilidad Expo y export Android. El workflow no configura protección de main; se puede exigir Mobile CI / quality y una aprobación desde GitHub.

## Integraciones pendientes

El contrato móvil inicial está versionado en `contracts/openapi.json` y genera los tipos consumidos por el catálogo. El equipo Web/API debe alinear su `/openapi.json` con esta operación o reemplazar el archivo y regenerar los tipos antes de integrar el backend. Aún se deben acordar GeoJSON, errores, roles y semillas.

SQLite y SecureStore están instalados; migraciones, caché por usuario/organización, TTL, fallback offline y limpieza al salir se implementan en sus tareas. Para AQU-41, implementar E2E después del login y detalle con cuentas de prueba. Las pruebas iniciales cubren HTTP/configuración, no certifican auth, mapas ni offline.

## Referencias

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- [Supabase React Native](https://supabase.com/docs/guides/auth/quickstarts/react-native)
- [MapLibre Expo](https://maplibre.org/maplibre-react-native/docs/setup/expo/)
