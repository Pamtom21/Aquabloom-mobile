import type { StoredObservation } from './observationSchema';

export type DraftDatabase = {
  execAsync: (sql: string) => Promise<void>;
  runAsync: (
    sql: string,
    ...params: (string | number | null)[]
  ) => Promise<unknown>;
  getFirstAsync: <T>(
    sql: string,
    ...params: (string | number | null)[]
  ) => Promise<T | null>;
};
export type ObservationStore = {
  durability: 'device' | 'session';
  save: (record: StoredObservation) => Promise<void>;
  latest: (
    apiScope: string,
    ownerId: string,
    lakeId: string,
  ) => Promise<StoredObservation | null>;
};

// Dedicated UI adapter; does not migrate or clear the shared catalog cache.
export function createDraftStore(
  open: () => Promise<DraftDatabase>,
  parse: (data: unknown) => StoredObservation,
): ObservationStore {
  let database: Promise<DraftDatabase> | undefined;
  const db = () =>
    (database ??= open()
      .then(async (value) => {
        const version = await value.getFirstAsync<{ user_version: number }>(
          'PRAGMA user_version',
        );
        if ((version?.user_version ?? 0) > 1)
          throw new Error('Versión de borradores no compatible.');
        await value.execAsync(`
      CREATE TABLE IF NOT EXISTS observation_form_drafts (
        api_scope TEXT NOT NULL, owner_id TEXT NOT NULL, id TEXT NOT NULL,
        lake_id TEXT NOT NULL, payload TEXT NOT NULL, saved_at TEXT NOT NULL,
        PRIMARY KEY (api_scope, owner_id, id)
      );
      CREATE INDEX IF NOT EXISTS observation_form_lake ON observation_form_drafts(api_scope, owner_id, lake_id, saved_at);
      PRAGMA user_version = 1;
    `);
        return value;
      })
      .catch((error: unknown) => {
        database = undefined;
        throw error;
      }));
  return {
    durability: 'device',
    async save(input) {
      const record = parse(input);
      const value = await db();
      await value.runAsync(
        'INSERT INTO observation_form_drafts(api_scope, owner_id, id, lake_id, payload, saved_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(api_scope, owner_id, id) DO UPDATE SET lake_id = excluded.lake_id, payload = excluded.payload, saved_at = excluded.saved_at',
        record.apiScope,
        record.ownerId,
        record.id,
        record.values.lakeId,
        JSON.stringify(record),
        record.savedAt,
      );
    },
    async latest(apiScope, ownerId, lakeId) {
      const value = await db();
      const row = await value.getFirstAsync<{ payload: string }>(
        'SELECT payload FROM observation_form_drafts WHERE api_scope = ? AND owner_id = ? AND lake_id = ? ORDER BY saved_at DESC, rowid DESC LIMIT 1',
        apiScope,
        ownerId,
        lakeId,
      );
      if (!row) return null;
      const record = parse(JSON.parse(row.payload));
      if (
        record.apiScope !== apiScope ||
        record.ownerId !== ownerId ||
        record.values.lakeId !== lakeId
      )
        throw new Error('El borrador no corresponde al contexto actual.');
      return record;
    },
  };
}

export function createSessionDraftStore(
  parse: (data: unknown) => StoredObservation,
): ObservationStore {
  const records = new Map<string, StoredObservation>();
  return {
    durability: 'session',
    async save(input) {
      const record = parse(input);
      records.set(
        JSON.stringify([record.apiScope, record.ownerId, record.id]),
        record,
      );
    },
    async latest(apiScope, ownerId, lakeId) {
      return (
        [...records.values()]
          .filter(
            (record) =>
              record.apiScope === apiScope &&
              record.ownerId === ownerId &&
              record.values.lakeId === lakeId,
          )
          .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
          .at(0) ?? null
      );
    },
  };
}
