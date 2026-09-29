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

## AQU-30 — Polígonos

El selector consulta el catálogo por páginas de 20 y carga el detalle del lago
elegido mediante los hooks existentes (incluida su caché). La geometría `geom`
debe ser Polygon o MultiPolygon con coordenadas finitas en longitud/latitud y
anillos cerrados de al menos cuatro posiciones. Se preservan huecos e islas.
No se inventan coordenadas si faltan o son inválidas: se informa al usuario.
MapLibre dibuja relleno y borde, y ajusta la cámara a los límites del lago.
Las pruebas cubren geometrías válidas/erróneas, selección y paginación.
Queda pendiente comprobar los polígonos de la API desplegada en Android.
