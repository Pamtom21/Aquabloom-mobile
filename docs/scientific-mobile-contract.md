# Contrato móvil de estimaciones — propuesta para Web/API

Estado: **propuesta, pendiente de acuerdo con Web/API**. Referencia: AQU-247.
El contrato científico de AQU-158 y su publicación en OpenAPI (AQU-159)
siguen pendientes. El OpenAPI móvil actual solo contiene el catálogo. Este
documento enumera lo que el móvil necesita; no certifica una ruta ni una
respuesta disponible en el servidor.

## Resultado por punto

| Dato que necesita el móvil         | Forma propuesta                                                | Situación en el OpenAPI actual |
| ---------------------------------- | -------------------------------------------------------------- | ------------------------------ |
| Identidad del resultado y del lago | `id`, `lake_id` (UUID)                                         | Ausente                        |
| Punto y coordenadas                | `point_id`, `latitude`, `longitude`; coordenadas pueden faltar | Ausente                        |
| Magnitud y unidad                  | `value` numérico, `unit`, `variable` (clorofila-a)             | Ausente                        |
| Fecha de la estimación             | `observed_at` en UTC                                           | Ausente                        |
| Estado científico                  | `status`, incluida la condición experimental                   | Ausente                        |
| Escena de origen                   | `scene_id`                                                     | Ausente                        |
| Modelo y versión                   | `model_id`, `model_version`                                    | Ausente                        |
| Dataset y versión                  | `dataset_id`, `dataset_version`                                | Ausente                        |
| Advertencias                       | `warnings` como lista de mensajes                              | Ausente                        |

El móvil debe indicar expresamente los metadatos ausentes. No debe convertir
una estimación experimental en medición validada ni interpretar clorofila-a
como toxicidad. Si no existe incertidumbre calibrada, debe indicarlo; nunca
inventar un intervalo.

## Trabajo científico

El seguimiento necesita `id`, `status` (`queued`, `running`, `completed`,
`failed`, `cancelled`) y fecha de actualización UTC. El progreso y un mensaje
seguro de error son opcionales. Consultar un trabajo no inicia entrenamiento.
La creación de trabajos queda fuera del alcance de estos adaptadores.

## Acuerdos pendientes

- Confirmar con Web/API los nombres, tipos y nulabilidad exactos de cada campo,
  la unidad de clorofila-a y el significado de `status` del resultado.
- Confirmar rutas GET de estimaciones por lago y de trabajo por identificador,
  paginación, permisos y códigos de error. Las rutas de la propuesta local de
  OpenAPI son solo para desarrollo.
- Sustituir la propuesta por el OpenAPI publicado en AQU-159 y regenerar los
  tipos antes de integrar consultas reales o dar AQU-247/248 por acordadas.

La comprobación de integración real corresponde a AQU-284 y no se acredita
con ejemplos locales.
