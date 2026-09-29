# Lagos (AQU-33–40)

El contrato versionado genera `Lake` y `LakeListResponse`. `useLakes` normaliza
los filtros, los incorpora en la `queryKey` y propaga `AbortSignal` hasta el
cliente HTTP. La primera página usa 20 elementos y el contrato limita el máximo
a 100.

`useLakeDetail` y `useStations` consultan el detalle y las estaciones del lago.
Validan UUID, respuestas y pertenencia de estaciones. Las pantallas manejan
carga, errores, vacío y navegación mediante enlaces directos. La ficha de una
estación la busca dentro del listado del lago, según el contrato del backend.

Los tres hooks usan caché SQLite nativa para consultas sin conexión, muestran
la fecha de los datos guardados y vuelven a consultar al reconectar.
