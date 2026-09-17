import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AsyncState } from '../../components/AsyncState';
import { Screen } from '../../components/Screen';
import { tokens } from '../../theme/tokens';
import { LakeCard } from './LakeCard';
import type { LakeFilters } from './types';
import { useLakes } from './useLakes';

const initialFilters: LakeFilters = { page: 1, page_size: 20 };

function readableCatalogError(error: unknown) {
  if (error instanceof Error && error.message.includes('EXPO_PUBLIC_API_URL')) {
    return error.message;
  }
  return 'No pudimos cargar el catálogo. Revisa tu conexión e inténtalo nuevamente.';
}

export function CatalogScreen() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [filters, setFilters] = useState<LakeFilters>(initialFilters);
  const lakes = useLakes(filters);

  const applyFilters = () => {
    setFilters({
      search,
      region,
      page: 1,
      page_size: initialFilters.page_size,
    });
  };
  const clearFilters = () => {
    setSearch('');
    setRegion('');
    setFilters(initialFilters);
  };
  const hasFilters = Boolean(filters.search || filters.region);

  return (
    <Screen title="Catálogo de lagos">
      <View accessibilityRole="search" style={styles.filters}>
        <Text style={styles.sectionTitle}>Buscar en el catálogo</Text>
        <TextInput
          accessibilityLabel="Nombre del lago"
          autoCapitalize="words"
          onChangeText={setSearch}
          onSubmitEditing={applyFilters}
          placeholder="Ej. Villarrica"
          returnKeyType="search"
          style={styles.input}
          value={search}
        />
        <TextInput
          accessibilityLabel="Región"
          autoCapitalize="words"
          onChangeText={setRegion}
          onSubmitEditing={applyFilters}
          placeholder="Ej. La Araucanía"
          returnKeyType="search"
          style={styles.input}
          value={region}
        />
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={applyFilters}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Aplicar filtros</Text>
          </Pressable>
          {hasFilters ? (
            <Pressable
              accessibilityRole="button"
              onPress={clearFilters}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Limpiar</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {lakes.isPending ? (
        <AsyncState kind="loading" message="Cargando catálogo de lagos…" />
      ) : lakes.isError ? (
        <AsyncState
          kind="error"
          message={readableCatalogError(lakes.error)}
          onRetry={() => lakes.refetch()}
        />
      ) : lakes.data.items.length === 0 ? (
        <AsyncState
          kind="empty"
          message="No encontramos lagos para los filtros seleccionados."
        />
      ) : (
        <View style={styles.results}>
          <View style={styles.resultsHeading}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              {lakes.data.total} {lakes.data.total === 1 ? 'lago' : 'lagos'}
            </Text>
            {lakes.isFetching ? (
              <ActivityIndicator
                accessibilityLabel="Actualizando catálogo"
                color={tokens.colors.primary}
                size="small"
              />
            ) : null}
          </View>
          {lakes.data.items.map((lake) => (
            <LakeCard key={lake.id} lake={lake} />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    gap: tokens.spacing.sm,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius,
    backgroundColor: tokens.colors.surface,
  },
  sectionTitle: {
    color: tokens.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    paddingHorizontal: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius,
    backgroundColor: tokens.colors.background,
    color: tokens.colors.text,
  },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.sm },
  primaryButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius,
    backgroundColor: tokens.colors.primary,
  },
  primaryButtonText: { color: tokens.colors.surface, fontWeight: '700' },
  secondaryButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.primary,
    borderRadius: tokens.radius,
  },
  secondaryButtonText: { color: tokens.colors.primary, fontWeight: '700' },
  pressed: { opacity: 0.72 },
  results: { gap: tokens.spacing.md },
  resultsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
