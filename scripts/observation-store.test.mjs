import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  createDraftStore,
  createSessionDraftStore,
} from '../src/features/observations/draftStore.ts';
import { saveObservation } from '../src/features/observations/saveObservation.ts';

const parse = (value) => value;
const record = (overrides = {}) => ({
  version: 1,
  id: '11111111-1111-4111-8111-111111111111',
  ownerId: 'franco',
  apiScope: 'api-a',
  values: {
    lakeId: '22222222-2222-4222-8222-222222222222',
    observedAt: '2026-10-07T12:00:00Z',
    note: 'Nota inicial',
    location: null,
    photoUri: null,
  },
  savedAt: '2026-10-07T12:01:00Z',
  status: 'pending_send',
  ...overrides,
});
function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'aquabloom-observation-test-'));
  const filename = join(directory, 'drafts.db');
  let database = new DatabaseSync(filename);
  const adapter = {
    async execAsync(sql) {
      database.exec(sql);
    },
    async runAsync(sql, ...params) {
      return database.prepare(sql).run(...params);
    },
    async getFirstAsync(sql, ...params) {
      return database.prepare(sql).get(...params) ?? null;
    },
  };
  t.after(() => {
    database.close();
    rmSync(directory, { recursive: true });
  });
  return {
    adapter,
    store: createDraftStore(async () => adapter, parse),
    reopen() {
      database.close();
      database = new DatabaseSync(filename);
      return createDraftStore(async () => adapter, parse);
    },
  };
}
test('recovers the same pending draft after closing and reopening SQLite', async (t) => {
  const f = fixture(t);
  const input = record();
  await f.store.save(input);
  assert.deepEqual(
    await f.reopen().latest(input.apiScope, input.ownerId, input.values.lakeId),
    input,
  );
});
test('persists complete capture fields and the durable photo reference after reopening SQLite', async (t) => {
  const f = fixture(t);
  const input = record({
    values: {
      ...record().values,
      photoUri: 'file:///camera/temp.jpg',
      location: {
        latitude: -39.64,
        longitude: -72.33,
        accuracy: 5,
        capturedAt: '2026-10-14T12:00:00Z',
      },
    },
  });
  const photos = {
    async prepare() {
      return { uri: 'file:///documents/managed.jpg', created: true };
    },
    async removeCreated() {
      assert.fail('successful save must not remove its photo');
    },
  };
  const saved = await saveObservation(input, f.store, photos);
  const recovered = await f
    .reopen()
    .latest(input.apiScope, input.ownerId, input.values.lakeId);
  assert.deepEqual(recovered, saved);
  assert.equal(recovered.values.photoUri, 'file:///documents/managed.jpg');
  assert.equal(recovered.status, 'pending_send');
});
test('a failed photo preparation preserves the preceding SQLite draft and its photograph', async (t) => {
  const f = fixture(t);
  const previous = record({
    values: { ...record().values, photoUri: 'file:///documents/old.jpg' },
  });
  await f.store.save(previous);
  const changed = record({
    values: {
      ...previous.values,
      photoUri: 'file:///camera/missing.jpg',
      note: 'Unsaved change',
    },
  });
  await assert.rejects(
    saveObservation(changed, f.store, {
      async prepare() {
        throw new Error('source missing');
      },
      async removeCreated() {
        assert.fail('nothing was copied');
      },
    }),
    /source missing/,
  );
  assert.deepEqual(
    await f
      .reopen()
      .latest(previous.apiScope, previous.ownerId, previous.values.lakeId),
    previous,
  );
});
test('updates a UUID without duplicating it and binds the note safely', async (t) => {
  const f = fixture(t);
  await f.store.save(record());
  const updated = record({
    values: {
      ...record().values,
      note: "'); DROP TABLE observation_form_drafts;--",
    },
  });
  await f.store.save(updated);
  assert.deepEqual(
    await f.store.latest(
      updated.apiScope,
      updated.ownerId,
      updated.values.lakeId,
    ),
    updated,
  );
  assert.equal(
    (
      await f.adapter.getFirstAsync(
        'SELECT count(*) AS count FROM observation_form_drafts',
      )
    ).count,
    1,
  );
});
test('isolates user, API environment and lake while preserving other owners records', async (t) => {
  const { store } = fixture(t);
  const input = record();
  await store.save(input);
  assert.equal(
    await store.latest(input.apiScope, 'other', input.values.lakeId),
    null,
  );
  assert.equal(
    await store.latest('other-api', input.ownerId, input.values.lakeId),
    null,
  );
  assert.equal(
    await store.latest(input.apiScope, input.ownerId, 'other-lake'),
    null,
  );
  await store.save(record({ ownerId: 'other' }));
  assert.equal(
    (await store.latest(input.apiScope, input.ownerId, input.values.lakeId))
      .ownerId,
    'franco',
  );
});
test('does not overwrite or silently discard malformed stored content', async (t) => {
  const f = fixture(t);
  const input = record();
  await f.store.save(input);
  await f.adapter.runAsync(
    'UPDATE observation_form_drafts SET payload = ?',
    '{broken',
  );
  await assert.rejects(
    f.store.latest(input.apiScope, input.ownerId, input.values.lakeId),
    SyntaxError,
  );
  assert.equal(
    (
      await f.adapter.getFirstAsync(
        'SELECT count(*) AS count FROM observation_form_drafts',
      )
    ).count,
    1,
  );
});
test('rejects a payload that claims another owner despite the scoped row', async (t) => {
  const f = fixture(t);
  const input = record();
  await f.store.save(input);
  await f.adapter.runAsync(
    'UPDATE observation_form_drafts SET payload = ?',
    JSON.stringify(record({ ownerId: 'other' })),
  );
  await assert.rejects(
    f.store.latest(input.apiScope, input.ownerId, input.values.lakeId),
    /contexto/,
  );
});
test('retries opening storage after failure and does not downgrade a newer schema', async (t) => {
  const f = fixture(t);
  let attempts = 0;
  const store = createDraftStore(async () => {
    if (++attempts === 1) throw new Error('disk unavailable');
    return f.adapter;
  }, parse);
  await assert.rejects(store.save(record()), /disk unavailable/);
  await store.save(record());
  await f.adapter.execAsync('PRAGMA user_version = 2');
  await assert.rejects(f.reopen().save(record()), /no compatible/);
  assert.equal(
    (await f.adapter.getFirstAsync('PRAGMA user_version')).user_version,
    2,
  );
});
test('browser adapter declares session storage and isolates identities', async () => {
  const store = createSessionDraftStore(parse);
  const input = record();
  await store.save(input);
  assert.equal(store.durability, 'session');
  assert.equal(
    await store.latest(input.apiScope, 'other', input.values.lakeId),
    null,
  );
  assert.deepEqual(
    await store.latest(input.apiScope, input.ownerId, input.values.lakeId),
    input,
  );
  assert.equal(
    await createSessionDraftStore(parse).latest(
      input.apiScope,
      input.ownerId,
      input.values.lakeId,
    ),
    null,
  );
});
