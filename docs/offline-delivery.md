# Caché y modo sin conexión (AQU-49–52)

Se completa la persistencia del catálogo público en Android/iOS, sobre la
entrega de detalle de lagos y estaciones. No se modifica AquaBloomSur2do.

| Tarea  | Implementación                                                                                                              |
| ------ | --------------------------------------------------------------------------------------------------------------------------- |
| AQU-49 | Esquema SQLite v1, migración transaccional, índice de vencimiento y consultas parametrizadas.                               |
| AQU-50 | Respuestas validadas por API, usuario y filtros; caducidad de 24 horas, límite de 200 entradas y limpieza al cerrar sesión. |
| AQU-51 | Consulta local sin red y ante fallos de transporte; aviso con fecha y actualización al reconectar.                          |
| AQU-52 | Pruebas con archivos SQLite reales, reapertura, vencimiento, aislamiento, cancelaciones, errores y flujo de pantallas.      |

La caché guarda listas, detalle de lago y estaciones. Rechaza datos corruptos,
caducados o con fecha futura. No sustituye errores HTTP o de validación por
respuestas antiguas. Un 401/403/404 elimina la copia afectada. Una avería de
almacenamiento no impide mostrar respuestas válidas de la red.

Al salir o cambiar de cuenta se invalidan las operaciones pendientes y se
eliminan las respuestas. Las escrituras están serializadas para impedir que
una respuesta tardía vuelva a llenar una caché limpiada. Si el borrado falla,
la persistencia queda deshabilitada y el cierre no se presenta como exitoso.

Las lecturas del backend de referencia son públicas y no tienen organización.
La partición incluye el usuario y una categoría de catálogo público; no se
almacenan tokens, perfiles ni datos privados. Una futura API privada requiere
definir su partición por organización antes de reutilizar esta persistencia.

## Validación local

- `pnpm run check`: formato, ESLint y TypeScript aprobados; 92 pruebas Jest
  en 20 suites y 15 pruebas SQLite aprobadas (107 en total).
- `pnpm run test:offline`: 15 pruebas sobre archivos SQLite temporales reales.
- Jest comprueba recuperación sin red, mensajes, reconexión inmediata,
  separación por identidad y limpieza al salir, además de la suite existente.
- `pnpm run export:android`: valida el bundle; no equivale a un APK instalado.

Se usa Node 24 y pnpm 11.5.0. Las pruebas SQL usan `node:sqlite` con el mismo
esquema y consultas del módulo móvil; Jest sustituye el adaptador nativo.
Falta verificar el controlador Expo SQLite en un dispositivo real y con una
API desplegada. Web continúa sin almacenamiento SQLite; no se habilitan WASM
ni cabeceras de aislamiento. La sesión Supabase sigue en memoria (AQU-17).

Mobile CI queda manual por decisión del propietario. No se lanzan pruebas ni
builds remotos. Los estados de Linear no se actualizan automáticamente.

## Comprobación en dispositivo

1. Con una API configurada, abrir catálogo, un lago y sus estaciones.
2. Cerrar y abrir la app sin red: consultar las mismas páginas y revisar el aviso.
3. Consultar filtros no visitados: debe indicar que no hay datos guardados.
4. Recuperar conexión: deben actualizarse los resultados y desaparecer el aviso.
5. Cerrar sesión o cambiar de cuenta: no deben reaparecer copias de la identidad anterior.

Con sesiones en memoria, el reinicio vuelve al contexto invitado; la caché de
una identidad autenticada nunca se reutiliza como caché del invitado.
