/* global jest */
// Native SQLite is exercised separately with the real SQLite engine in
// scripts/offline.test.mjs. UI tests simulate a platform without persistence.
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(async () => null),
}));
