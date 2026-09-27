# Auth (AQU-17–28)

El cliente en `src/lib/supabase.ts` mantiene la sesión en memoria. El formulario
de login usa Supabase; `AuthProvider` carga la sesión, escucha sus eventos y
expone `useCurrentUser`. La configuración del cliente es fija durante la vida
del proveedor; para cambiarla hay que reiniciar la app.

`ProfileScreen` muestra nombre, correo y teléfono disponibles, sin tokens ni
roles inferidos. Un visitante puede abrir el login; si Supabase no está
configurado se muestra un mensaje de indisponibilidad.

`signOutAndClearCache` usa `scope: local`, cancela las consultas y limpia las
cachés de consultas y mutaciones antes y después del cierre. Mientras ocurre,
el proveedor desmonta las pantallas para impedir nuevas consultas. Si Supabase
falla, se conserva la sesión y se ofrece reintento; nunca se informa éxito falso.
Al cambiar de cuenta o recibir SIGNED_OUT también se descartan consultas y estado
de pantallas. Los refrescos del mismo usuario conservan la caché.

Las pruebas de integración ejercitan formulario, SDK real de Supabase,
AuthProvider y perfil con transporte HTTP simulado. No requieren credenciales.

Pendientes de AQU-17–19: SecureStore (sin truncar sesiones), refresh por AppState
y protección general de rutas. No guardar tokens en SQLite. Al implementar la
caché persistente, su borrado debe añadirse al cierre y a los cambios de usuario
antes de habilitarla. Ver `docs/jose-auth-delivery.md` para alcance y evidencia.
