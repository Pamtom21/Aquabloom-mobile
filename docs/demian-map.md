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

## AQU-31 — Estaciones

Se consultan las estaciones del lago seleccionado con el hook y caché existentes.
Sólo se dibujan puntos GeoJSON válidos pertenecientes a ese lago; no se sustituyen
coordenadas ausentes por (0,0). Los círculos naranjos contrastan con los polígonos,
mantienen el ID de la estación y se actualizan al cambiar de lago. Se informa el
número de ubicaciones disponibles, registros sin coordenadas, carga y errores.
La cabecera permite desplazamiento vertical en pantallas pequeñas.

## AQU-32 — Ficha inferior

Tocar el polígono o un marcador abre la ficha del elemento seleccionado. El
selector de lagos y los botones de estaciones ofrecen la misma acción de forma
accesible. La ficha muestra nombre, región o código, estado y descripción; enlaza
al detalle existente y permite cerrarse. Cambiar de lago reemplaza la selección
anterior. No se muestra una estación que ya no pertenezca al lago actual.
La ficha ocupa una sección inferior limitada y desplazable sin cubrir la
atribución del mapa. Se prueba selección, reemplazo, cierre y destino del enlace.
