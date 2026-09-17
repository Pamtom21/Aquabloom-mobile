# Contrato API

`openapi.json` versiona el contrato consumido por el cliente móvil para el
catálogo de lagos. Los tipos se regeneran con:

```sh
pnpm run api:setup
pnpm run api:generate -- ./contracts/openapi.json
```

El archivo no contiene tokens ni datos privados. Cualquier cambio incompatible
del backend debe actualizar primero el contrato, regenerar
`src/types/api.generated.ts` y ejecutar las pruebas del cliente.
