import type { PhotoStorage } from './photoStorage';
export const photoPersistence: PhotoStorage = {
  async prepare() { throw new Error('La persistencia fotográfica requiere Android/iOS.'); },
  async removeCreated() {},
};
