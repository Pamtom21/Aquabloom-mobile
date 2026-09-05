# Auth (AQU-17–28)

Cliente disponible en src/lib/supabase.ts con sesiones en memoria. Implementar SecureStore (considerar tamaño de sesión sin truncar tokens), refresh por AppState, AuthProvider, protección y login. Logout debe cancelar consultas y limpiar caché por usuario. No guardar tokens en SQLite.
