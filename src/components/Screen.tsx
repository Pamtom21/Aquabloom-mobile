import type { PropsWithChildren } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { resolveResponsiveLayout } from '../theme/responsive';
import { tokens } from '../theme/tokens';

export function Screen({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  const { fontScale, width } = useWindowDimensions();
  const layout = resolveResponsiveLayout(width, fontScale);

  return (
    <SafeAreaView
      accessibilityLanguage="es-CL"
      style={styles.safe}
      edges={['left', 'right', 'bottom']}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: layout.horizontalPadding },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          accessibilityRole="header"
          maxFontSizeMultiplier={2}
          style={[styles.title, layout.isCompact && styles.compactTitle]}
        >
          {title}
        </Text>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.colors.background },
  content: {
    paddingVertical: tokens.spacing.lg,
    gap: tokens.spacing.md,
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  title: { fontSize: 28, fontWeight: '700', color: tokens.colors.text },
  compactTitle: { fontSize: 24 },
});
