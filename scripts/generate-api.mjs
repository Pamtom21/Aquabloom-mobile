import { readFile, mkdir, writeFile } from 'node:fs/promises';
import openapiTS, {
  astToString,
} from '../tools/openapi/node_modules/openapi-typescript/dist/index.mjs';

const source = process.argv[2];
if (!source) {
  console.error(
    'Uso: npm run api:generate -- ./contracts/openapi.json (contrato real FastAPI)',
  );
  process.exit(1);
}
const schema = JSON.parse(await readFile(source, 'utf8'));
const types = await openapiTS(schema);
await mkdir('src/types', { recursive: true });
await writeFile('src/types/api.generated.ts', astToString(types));
console.log('Tipos generados desde el contrato suministrado.');
