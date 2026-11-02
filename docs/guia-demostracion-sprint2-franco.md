# Guía de uso y demostración — Sprint 2 móvil

Preparada el 2 de noviembre de 2026 para la presentación del 3 de noviembre.
Responsable: Franco Oyarzo. Entrega AQU-275–278, AQU-290 y AQU-291.

## Qué se puede afirmar

El móvil permite consultar el catálogo, editar observaciones y guardarlas como
borradores locales pendientes de envío. La nueva interfaz científica tiene lista,
detalle trazable y estado de trabajos. El contrato científico de Demian sigue
siendo una **propuesta pendiente de acuerdo con Web/API**; una demostración
local no acredita consumo del servicio real ni validación del modelo.

Una fotografía u observación ciudadana no es una medición validada. Una
estimación de clorofila-a no permite concluir toxicidad ni que el agua sea segura.
Un trabajo completado tampoco acredita calidad científica del resultado.

## Preparar el equipo

```sh
pnpm install --frozen-lockfile
pnpm run check
pnpm run test:e2e
pnpm run doctor
pnpm run export:android
pnpm run web
```

Para catálogo y autenticación se requieren los valores públicos reales en
`.env.local`, acceso al backend y una cuenta autorizada. No pegar tokens ni
contraseñas en capturas o diapositivas. El flujo E2E usa cuentas/HTTP de prueba;
esas credenciales no sirven para iniciar sesión en un servicio real.

Si no hay backend disponible, `pnpm run test:e2e` reproduce el flujo con datos
de prueba aislados. Mostrar su evidencia como **prueba automatizada**, no como
una sesión real de producción. No cambiar la configuración para apuntar a
servicios desconocidos ni habilitar propuestas pendientes sólo para ocultar errores.

## Recorrido breve de presentación (5–7 minutos)

1. **Catálogo y contexto.** Abrir un lago e identificar el nombre/región. Entrar
   a **Observaciones de terreno**; iniciar sesión si se solicita. El destino
   conserva el lago seleccionado.
2. **Borrador.** Escribir fecha/hora local y nota. Mostrar que **Finalizar
   observación** está deshabilitado si faltan foto o ubicación. **Guardar borrador
   local** sí permite conservar trabajo incompleto: no significa captura finalizada.
3. **Recuperación y edición.** Abrir **Ver borradores guardados**, recuperar un
   registro, modificar la nota y guardar. Crear un segundo borrador y alternar
   entre ambos. Eliminar requiere confirmar; cancelar conserva el registro.
4. **Ciencia sin confundir fuentes.** Desde el lago abrir **Estimaciones
   científicas**. En la configuración normal se informa que la consulta remota
   está deshabilitada. Pulsar **Abrir demostración local** de forma explícita.
   Mostrar el aviso permanente de datos sintéticos y que no consulta al servidor.
5. **Trazabilidad.** Abrir **Ver estimación P-DEMO-01**. Señalar fecha UTC,
   punto, valor/unidad, escena, modelo y versión; dataset/version faltantes se
   identifican como **No informado**, no se inventan. Leer la advertencia de
   incertidumbre calibrada ausente y la condición experimental.
6. **Trabajo existente.** Volver a la lista y abrir **Ver trabajo de
   demostración**. Recorrer cola, ejecución, completado, fallo y cancelación.
   Sólo ejecución incluye un 30% suministrado por el ejemplo; los demás declaran
   progreso no informado. No se crean trabajos ni se inicia entrenamiento.
7. **Cierre honesto.** Distinguir implementación/pruebas locales de Android
   instalado, sensores reales y staging. Las verificaciones Android AQU-288–289
   siguen pendientes por falta de dispositivo; no presentar este recorrido web
   como comprobación física de cámara, GPS o teclado Android.

## Captura offline en Android, cuando haya dispositivo

Se necesita un development build reconstruido con `pnpm run android:build`
y Android SDK/JDK configurados; Expo Go no incluye todos los módulos nativos.
La exportación JavaScript no genera ni instala un APK.

1. Con sesión iniciada, abrir un lago y crear un borrador. Capturar foto y
   posición mediante las acciones explícitas; revisar la vista previa y precisión.
2. Desconectar la red y guardar. La confirmación sólo aparece después de copiar
   la foto al almacenamiento persistente y guardar el registro local.
3. Cerrar/reabrir la app, recuperar, editar y guardar el mismo borrador. Comprobar
   foto, coordenadas, fecha, nota y estado **Pendiente de envío / No validado**.
4. Rechazar cámara y ubicación y cancelar captura: conservar campos y orientación
   para continuar; nunca mostrar una captura incompleta como finalizada.
5. Probar cancelación y confirmación de eliminación con un registro de prueba
   expresamente desechable. Confirmar que otro borrador permanece intacto.

No hacer esta prueba destructiva con observaciones reales del usuario. El móvil
no incorpora envío automático ni sincronización acordada; recuperar conectividad
no transforma un pendiente local en un envío confirmado.

## Habilitación de consultas científicas reales

`EXPO_PUBLIC_SCIENTIFIC_API_ENABLED=false` es el valor seguro por defecto. Cambiar
a `true` sólo tras acordar/publicar rutas, permisos y contrato con Web/API y
configurar `EXPO_PUBLIC_API_URL` para ese entorno. Reiniciar Metro después.

Los GET propuestos son `/lakes/{lake_id}/estimates` y
`/scientific/jobs/{job_id}`. No se declaran rutas disponibles en staging. El
detalle selecciona el resultado del listado de su lago, sin inventar un endpoint
de detalle. Si ocurre error no se reemplaza silenciosamente con ejemplos.

## Errores que conviene poder explicar

- **Permiso rechazado:** se conserva la edición. Si ya no se puede solicitar,
  orientar a Ajustes. Se puede guardar un borrador incompleto.
- **GPS apagado/sin precisión o timeout:** reintentar; no se usan coordenadas ficticias.
- **Foto ausente:** reemplazar antes de finalizar; conservar los demás campos.
- **Fallo de disco:** no confirmar éxito. Reintentar sin borrar la foto original.
- **401/403:** sesión/permisos, no un resultado científico vacío.
- **Sin resultados:** es distinto de carga, error o contrato deshabilitado.
- **Web:** cámara/GPS no están disponibles en este recorrido; los borradores son
  memoria de sesión y se pierden al recargar, no equivalen a SQLite móvil.

## Integración y autoría

Se incorporan los commits de José de persistencia/listado/edición/eliminación y
los cuatro commits científicos de Demian manteniendo sus autores. Los nuevos
commits de Franco implementan las pantallas, navegación, accesibilidad, pruebas
y guía; no atribuyen como propio el trabajo previo de otros integrantes. No se
activa el workflow de la rama CI/CD ni se gastan builds remotos desde esta entrega.
