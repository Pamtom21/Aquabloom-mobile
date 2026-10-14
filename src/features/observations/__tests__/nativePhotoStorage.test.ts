import { nativePhotoStorage } from '../nativePhotoStorage';
import { scopeSegment } from '../photoStorage';

const mockFiles = new Map<string, number>();
jest.mock('expo-file-system', () => {
  const uri = (parts: (string | { uri: string })[]) => parts.map((part) => typeof part === 'string' ? part : part.uri).join('/').replace(/([^:])\/+/g, '$1/');
  class Directory {
    uri: string;
    constructor(...parts: (string | { uri: string })[]) { this.uri = uri(parts); }
    create() {}
  }
  class File {
    uri: string;
    constructor(...parts: (string | { uri: string })[]) { this.uri = uri(parts); }
    get exists() { return mockFiles.has(this.uri); }
    get size() { return mockFiles.get(this.uri) ?? null; }
    get extension() { return this.uri.slice(this.uri.lastIndexOf('.')); }
    copy(target: File) { mockFiles.set(target.uri, this.size!); }
    delete() { mockFiles.delete(this.uri); }
  }
  return { Directory, File, Paths: { document: { uri: 'file:///documents' } } };
});
const scope = { ownerId: 'franco', apiScope: 'https://api.example/v1', draftId: '11111111-1111-4111-8111-111111111111' };
beforeEach(() => { mockFiles.clear(); mockFiles.set('file:///cache/photo.jpg', 200); });
it('copies outside cache into an owned path and reuses a durable file without copying twice', async () => {
  const prepared = await nativePhotoStorage.prepare('file:///cache/photo.jpg', scope);
  expect(prepared.created).toBe(true);
  expect(prepared.uri).toMatch(/^file:\/\/\/documents\/observation-photos-v1\//);
  expect(await nativePhotoStorage.prepare(prepared.uri, scope)).toEqual({ ...prepared, created: false });
  expect(mockFiles.has('file:///cache/photo.jpg')).toBe(true);
  for (const segment of prepared.uri.replace('file:///documents/', '').split('/')) expect(segment.length).toBeLessThan(255);
});
it('rejects missing, empty or remote source photos', async () => {
  mockFiles.set('file:///cache/empty.jpg', 0);
  for (const uri of ['file:///missing.jpg', 'file:///cache/empty.jpg', 'https://example.com/private.jpg']) {
    await expect(nativePhotoStorage.prepare(uri, scope)).rejects.toThrow();
  }
});
it('rollback cannot remove camera sources or another account photo', async () => {
  const prepared = await nativePhotoStorage.prepare('file:///cache/photo.jpg', scope);
  await expect(nativePhotoStorage.removeCreated(prepared.uri, { ...scope, ownerId: 'other' })).rejects.toThrow('ámbito');
  await expect(nativePhotoStorage.removeCreated('file:///cache/photo.jpg', scope)).rejects.toThrow('ámbito');
  expect(mockFiles.has(prepared.uri)).toBe(true);
  await nativePhotoStorage.removeCreated(prepared.uri, scope);
  expect(mockFiles.has(prepared.uri)).toBe(false);
  expect(mockFiles.has('file:///cache/photo.jpg')).toBe(true);
});
it('encodes path traversal characters instead of creating filesystem segments', () => {
  expect(scopeSegment('../owner/../../api')).toMatch(/^[0-9a-f]+$/);
});
