import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { tokens } from '../theme/tokens';
import { AppButton } from './AppButton';

export function AsyncState({
  kind,
  message,
  onRetry,
}: {
  kind: 'loading' | 'error' | 'empty';
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View
      accessibilityLiveRegion={kind === 'error' ? 'assertive' : 'polite'}
      accessibilityState={{ busy: kind === 'loading' }}
      style={styles.container}
    >
      {kind === 'loading' && (
        <ActivityIndicator
          accessible
          accessibilityLabel="Cargando"
          accessibilityRole="progressbar"
          accessibilityState={{ busy: true }}
          color={tokens.colors.primary}
        />
      )}
      <Text
        accessibilityRole={kind === 'error' ? 'alert' : undefined}
        style={{
          color: kind === 'error' ? tokens.colors.error : tokens.colors.muted,
        }}
      >
        {message}
      </Text>
      {kind === 'error' && onRetry && (
        <AppButton
          accessibilityHint="Vuelve a ejecutar la operación que falló"
          onPress={onRetry}
        >
          Reintentar
        </AppButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: tokens.spacing.md },
});
