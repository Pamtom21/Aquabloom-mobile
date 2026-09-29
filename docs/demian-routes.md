# AQU-19 — Rutas privadas

El perfil (`/profile`) contiene datos de cuenta y usa RequireSession. Un acceso
directo sin sesión redirige a `/login?returnTo=/profile`, sin montar el perfil.
Al recuperar una sesión se espera a AuthProvider. Al cerrar sesión o recibir
SIGNED_OUT se desmonta el contenido privado y se exige autenticación otra vez.

Login redirige tras el cambio de identidad observado por AuthProvider, incluso
si el formulario fue desmontado por ese cambio. returnTo sólo acepta /profile;
cualquier destino externo o desconocido vuelve al inicio. Sin configuración
de Supabase se informa indisponibilidad en lugar de ofrecer un envío fallido.

Inicio, mapa, catálogo y detalle de lago/estación siguen siendo públicos,
coherentes con los endpoints de lectura del contrato actual. Toda nueva ruta
con datos privados debe usar RequireSession o un layout privado equivalente.
La autorización real de recursos corresponde al backend.

Pruebas: redirección sin montar datos privados, espera de restauración,
acceso con sesión, pérdida de sesión y lista permitida de destinos.
