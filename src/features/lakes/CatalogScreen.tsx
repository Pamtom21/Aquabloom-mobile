import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppButton } from '../../components/AppButton';
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
          accessibilityHint="Filtra el catálogo por nombre"
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
          accessibilityHint="Filtra el catálogo por región"
          autoCapitalize="words"
          onChangeText={setRegion}
          onSubmitEditing={applyFilters}
          placeholder="Ej. La Araucanía"
          returnKeyType="search"
          style={styles.input}
          value={region}
        />
        <View style={styles.actions}>
          <AppButton onPress={applyFilters}>Aplicar filtros</AppButton>
          {hasFilters ? (
            <AppButton onPress={clearFilters} variant="secondary">
              Limpiar
            </AppButton>
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
  results: { gap: tokens.spacing.md },
  resultsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
