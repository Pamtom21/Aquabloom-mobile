# AQU-17 — Persistencia de sesión

Android/iOS usan el adaptador de Expo SecureStore para la sesión Supabase. La
clave de sesión que genera Supabase separa proyectos. iOS permite acceso con el
dispositivo desbloqueado y no migra el elemento a otro dispositivo. No existe
fallback a almacenamiento sin cifrar; los errores de lectura/escritura se propagan.
Web conserva la sesión sólo en memoria.

SessionLifecycle inicia el refresco al entrar en primer plano y lo detiene al
pasar a segundo plano o desmontarse. El listener se libera. Supabase mantiene
su lógica de renovación al recuperar una sesión vencida.

Pruebas: SDK Supabase real con transporte controlado y adaptador SecureStore
simulado, recuperación en un cliente nuevo y eliminación al cerrar sesión;
fallo de almacenamiento y transiciones de AppState. Estas pruebas no certifican
el Keychain/Keystore de un teléfono. Comprobar login, cierre/reapertura y logout
en el APK de AQU-43 con el entorno real.

Referencias: [SecureStore](https://docs.expo.dev/versions/v57.0.0/sdk/securestore/)
y [ciclo de sesión Supabase](https://supabase.com/docs/guides/auth/quickstarts/react-native).
