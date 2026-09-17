import { readFile, mkdir, writeFile } from 'node:fs/promises';
import openapiTS, {
  astToString,
} from '../tools/openapi/node_modules/openapi-typescript/dist/index.mjs';

const source = process.argv.slice(2).find((argument) => argument !== '--');
if (!source) {
  console.error('Uso: pnpm run api:generate -- ./contracts/openapi.json');
  process.exit(1);
}
const schema = JSON.parse(await readFile(source, 'utf8'));
if (typeof schema.openapi !== 'string' || !schema.paths) {
  throw new Error('El archivo no contiene un contrato OpenAPI válido.');
}
const types = await openapiTS(schema, { alphabetize: true });
await mkdir('src/types', { recursive: true });
await writeFile(
  'src/types/api.generated.ts',
  [
    '// Este archivo es generado. No editar manualmente.',
    `// Fuente: ${source.replaceAll('\\\\', '/')}`,
    '',
    astToString(types),
  ].join('\n'),
);
console.log(`Tipos generados desde ${source}.`);
