import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tokens } from '../../theme/tokens';
import type { Lake } from './types';

export function LakeCard({ lake }: { lake: Lake }) {
  const location = [lake.commune, lake.region].filter(Boolean).join(', ');

  return (
    <Pressable
      accessibilityHint="Abre la ficha completa del lago"
      accessibilityLabel={`Ver detalle de ${lake.name}, ${location}`}
      accessibilityRole="button"
      onPress={() =>
        router.push({ pathname: '/lakes/[id]', params: { id: lake.id } })
      }
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.headingRow}>
        <Text style={styles.name}>{lake.name}</Text>
        {lake.status ? <Text style={styles.status}>{lake.status}</Text> : null}
      </View>
      <Text style={styles.location}>{location}</Text>
      {lake.description ? (
        <Text numberOfLines={2} style={styles.description}>
          {lake.description}
        </Text>
      ) : null}
      <Text style={styles.action}>Ver detalle →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: tokens.spacing.sm,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius,
    backgroundColor: tokens.colors.surface,
  },
  pressed: { opacity: 0.72 },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: tokens.spacing.sm,
  },
  name: {
    flex: 1,
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  status: {
    color: tokens.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  location: { color: tokens.colors.muted, fontWeight: '600' },
  description: { color: tokens.colors.text, lineHeight: 20 },
  action: { color: tokens.colors.primary, fontWeight: '700' },
});
