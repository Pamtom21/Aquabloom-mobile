# Semana 4 — Franco Oyarzo

Evidencia del bloque planificado entre el 24 y el 30 de septiembre de 2026 en
el proyecto de Linear **Sprint 1 - Aplicación móvil**. El alcance se limita a
AQU-45, AQU-46, AQU-47 y AQU-48, todos asignados a Franco Oyarzo.

## Matriz de aceptación

| Ticket                 | Criterio de Linear                                            | Implementación verificable                                                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AQU-45 — Accesibilidad | Las mejoras se verifican en las pantallas objetivo            | `AppButton` unifica objetivos táctiles de 48 puntos, roles, estado disabled y ayudas. Login, filtros, tarjetas y estados asíncronos comunican semántica, errores y progreso a tecnologías asistivas.            |
| AQU-46 — Responsive    | Las pantallas objetivo se adaptan a tamaños móviles definidos | `resolveResponsiveLayout` usa ancho y escala tipográfica. El shell ajusta márgenes; el catálogo apila controles en pantallas angostas, conserva una columna con texto grande y habilita dos columnas en tablet. |
| AQU-47 — Conectividad  | El banner informa cambios de conectividad globalmente         | `ConnectivityProvider` mantiene un estado triestado desde NetInfo, sincroniza React Query y monta un banner global accesible mientras no existe internet confirmado.                                            |
| AQU-48 — README        | README permite reproducir la configuración del proyecto       | La guía fija Node/pnpm, instalación congelada, entorno público, quality gates, comandos, estructura, Android/EAS y diagnóstico. Expo Doctor queda alineado mediante el mismo lockfile pnpm.                     |

## Cobertura automatizada agregada

- `AppButton.test.tsx`: semántica, superficie táctil, estado disabled y bloqueo de
  interacción.
- `AsyncState.test.tsx`: alerta de error y progreso ocupado anunciado.
- `responsive.test.ts`: teléfono angosto, tablet y escala tipográfica grande.
- `connectivity.test.ts`: inicialización, red conectada y desconexión explícita.
- `ConnectivityProvider.test.tsx`: pausa y reanudación de React Query.
- `ConnectivityBanner.test.tsx`: alerta offline y ausencia de espacio en estados
  online/unknown.
- Las pruebas existentes de Login y Catálogo continúan cubriendo envío, filtros,
  reintento y navegación después de adoptar los componentes compartidos.

## Resultado de validación

Ejecutado con Node 24.3.0 y pnpm 11.5.0:

```text
pnpm run check
  Prettier: aprobado
  ESLint: aprobado
  TypeScript: aprobado
  Jest: 18 suites / 65 pruebas aprobadas

pnpm run doctor
  Expo Doctor: 21/21 comprobaciones aprobadas

pnpm run export:android
  Bundle Android: 1.471 módulos, 27 assets, Hermes 4,4 MB
```

La exportación valida JavaScript y assets; no equivale a compilar ni instalar un
APK. La verificación nativa en dispositivo sigue requiriendo Android SDK, adb y
un development build con MapLibre.

## Historial revisable

El trabajo se separa por frontera técnica: primitiva accesible, adopción en
pantallas, política responsive, composición del catálogo, normalización de red,
proveedor global, banner, guía reproducible y alineación del runtime Expo. Cada
commit referencia su ticket y describe el efecto observable; no se utilizaron
commits vacíos ni cambios ajenos al bloque de Franco.
