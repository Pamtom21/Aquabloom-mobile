import { ActivityIndicator, Button, Text, View } from 'react-native';
import { tokens } from '../theme/tokens';

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
    <View accessibilityLiveRegion="polite" style={{ gap: tokens.spacing.md }}>
      {kind === 'loading' && (
        <ActivityIndicator
          accessibilityLabel="Cargando"
          color={tokens.colors.primary}
        />
      )}
      <Text
        style={{
          color: kind === 'error' ? tokens.colors.error : tokens.colors.muted,
        }}
      >
        {message}
      </Text>
      {kind === 'error' && onRetry && (
        <Button title="Reintentar" onPress={onRetry} />
      )}
    </View>
  );
}
