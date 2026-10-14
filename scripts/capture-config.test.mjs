import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const result = spawnSync(
  process.execPath,
  [require.resolve('expo/bin/cli'), 'config', '--type', 'introspect', '--json'],
  {
    cwd: new URL('../', import.meta.url),
    env: { ...process.env, EXPO_NO_DOTENV: '1' },
    encoding: 'utf8',
    timeout: 30_000,
  },
);
assert.equal(result.status, 0, result.stderr);
const config = JSON.parse(result.stdout);
const permissions =
  config._internal.modResults.android.manifest.manifest['uses-permission'];
test('generated Android config includes camera/foreground location and blocks audio/gallery/background access', () => {
  for (const name of [
    'android.permission.CAMERA',
    'android.permission.ACCESS_COARSE_LOCATION',
    'android.permission.ACCESS_FINE_LOCATION',
  ]) {
    assert.ok(
      permissions.some(
        (entry) =>
          entry.$['android:name'] === name &&
          entry.$['tools:node'] !== 'remove',
      ),
      name,
    );
  }
  for (const name of config.android.blockedPermissions) {
    assert.ok(
      permissions.some(
        (entry) =>
          entry.$['android:name'] === name &&
          entry.$['tools:node'] === 'remove',
      ),
      name,
    );
  }
});
test('generated iOS config explains camera/foreground location without microphone or photo-library permission', () => {
  const info = config.ios.infoPlist;
  assert.match(info.NSCameraUsageDescription, /fotografía.*observación local/);
  assert.match(info.NSLocationWhenInUseUsageDescription, /Capturar ubicación/);
  assert.equal(info.NSMicrophoneUsageDescription, undefined);
  assert.equal(info.NSPhotoLibraryUsageDescription, undefined);
  assert.equal(info.UIBackgroundModes?.includes('location') ?? false, false);
});
