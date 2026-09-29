import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Map, Camera } from '@maplibre/maplibre-react-native';
import { AsyncState } from '../../components/AsyncState';
import { tokens } from '../../theme/tokens';

export function LakeMap() {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  return (
    <View style={styles.container}>
      <Map
        key={attempt}
        testID="lake-map"
        style={StyleSheet.absoluteFill}
        mapStyle="https://demotiles.maplibre.org/style.json"
        onDidFinishLoadingMap={() => setStatus('ready')}
        onDidFailLoadingMap={() => setStatus('error')}
      >
        <Camera initialViewState={{ center: [-72.15, -39.28], zoom: 7 }} />
      </Map>
      {status !== 'ready' && (
        <View style={styles.notice}>
          <AsyncState
            kind={status}
            message={
              status === 'loading'
                ? 'Cargando mapa…'
                : 'No se pudo cargar el mapa. Comprueba tu conexión.'
            }
            onRetry={() => {
              setStatus('loading');
              setAttempt((value) => value + 1);
            }}
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 320 },
  notice: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: tokens.radius,
    backgroundColor: tokens.colors.surface,
  },
});
