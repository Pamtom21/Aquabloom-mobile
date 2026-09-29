# AQU-29 — Mapa base

La pestaña Mapa monta MapLibre Native y una cámara inicial sobre la zona de
Villarrica. Usa el estilo público de demostración de MapLibre, sin credenciales.
Debe elegirse un proveedor y sus condiciones de uso antes de producción.
La atribución del SDK permanece visible. No se solicita ubicación del usuario.

El mapa ocupa el espacio disponible sin un ScrollView que capture sus gestos.
Hay estados de carga y error; Reintentar monta una instancia nueva del mapa.
En web se ofrece acceso al catálogo sin importar módulos nativos.

Validación pendiente en Android: instalar un development build (Expo Go no
incluye MapLibre), abrir Mapa, comprobar teselas y atribución, desplazar y hacer
zoom, desconectar la red y reintentar. Las pruebas con eventos simulados y el
bundle Android no sustituyen esa validación visual ni una revisión del PR.
