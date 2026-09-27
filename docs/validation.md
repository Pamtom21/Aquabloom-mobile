# Verificación acumulada — 2026-09-27

- Gestor reproducible: pnpm 11.5.0 con `pnpm-lock.yaml`; instalación congelada
  documentada.
- Formato, ESLint y TypeScript: aprobados.
- Jest: 18 suites y 65 pruebas aprobadas.
- Expo Doctor: 21/21 comprobaciones aprobadas con SDK 57.0.25 y Router 57.0.23.
- Bundle JavaScript Android: 1.471 módulos, 27 assets y bundle Hermes de 4,4 MB
  exportados correctamente.
- OpenAPI: contrato versionado y tipos del catálogo generados en el repositorio.
- Accesibilidad: controles táctiles, estados asíncronos, formulario y tarjetas
  cubiertos mediante consultas semánticas.
- Responsive: breakpoints de teléfono/tablet y texto ampliado cubiertos por
  pruebas unitarias.
- Conectividad: clasificación NetInfo, coordinación de React Query y banner
  global cubiertos por pruebas de transición.

La exportación Android no equivale a un APK instalado. La compilación nativa y
la prueba manual con TalkBack/VoiceOver necesitan un dispositivo o emulador,
Android SDK/adb y un development build para MapLibre.

Las credenciales reales de Supabase/API, claves de firma y secretos EAS no se
incluyen en el repositorio. `.env.local` permanece fuera de Git.
