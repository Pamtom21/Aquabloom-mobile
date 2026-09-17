# Lagos (AQU-33–40)

El contrato versionado genera `Lake` y `LakeListResponse`. `useLakes` normaliza
los filtros, los incorpora en la `queryKey` y propaga `AbortSignal` hasta el
cliente HTTP. La primera página usa 20 elementos y el contrato limita el máximo
a 100.

Las coordenadas son opcionales hasta que las tareas de mapa definan los
polígonos GeoJSON. Los hooks de detalle y estaciones permanecen en AQU-37 y
AQU-38.
