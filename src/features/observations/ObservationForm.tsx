import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { tokens } from '../../theme/tokens';
import { DraftStatus } from './DraftStatus';
import {
  formatObservationDate,
  observationDraftSchema,
  parseObservationDate,
  type ObservationValues,
  type StoredObservation,
} from './observationSchema';

export type DraftPhase = 'editing' | 'saving' | 'saved';
type Props = {
  lakeId: string;
  lakeName: string;
  initial?: StoredObservation | null;
  durability: 'device' | 'session';
  onSave: (values: ObservationValues) => Promise<StoredObservation>;
};

export function ObservationForm({
  lakeId,
  lakeName,
  initial,
  durability,
  onSave,
}: Props) {
  const [dateText, setDateText] = useState(() =>
    formatObservationDate(
      initial ? new Date(initial.values.observedAt) : new Date(),
    ),
  );
  const [note, setNote] = useState(initial?.values.note ?? '');
  const [phase, setPhase] = useState<DraftPhase>(initial ? 'saved' : 'editing');
  const [savedAt, setSavedAt] = useState(initial?.savedAt ?? null);
  const [errors, setErrors] = useState<{
    date?: string;
    note?: string;
    save?: string;
  }>({});
  const pending = useRef(false);
  const isSaving = phase === 'saving';

  async function save() {
    if (pending.current) return;
    const observedAt = parseObservationDate(dateText);
    const result = observationDraftSchema.safeParse({
      lakeId,
      observedAt: observedAt ?? '',
      note,
      location: initial?.values.location ?? null,
      photoUri: initial?.values.photoUri ?? null,
    });
    if (!result.success) {
      setErrors({
        date: observedAt
          ? undefined
          : 'Ingresa una fecha real con formato AAAA-MM-DD HH:mm.',
        note:
          note.trim().length > 2000
            ? 'La nota admite hasta 2000 caracteres.'
            : undefined,
        save: result.error.issues.some(
          (issue) => !['note', 'observedAt'].includes(String(issue.path[0])),
        )
          ? 'Revisa el lago y los campos de captura del borrador.'
          : undefined,
      });
      return;
    }
    pending.current = true;
    setErrors({});
    setPhase('saving');
    try {
      const stored = await onSave(result.data);
      setSavedAt(stored.savedAt);
      setNote(stored.values.note);
      setPhase('saved');
    } catch {
      setErrors({
        save: 'No pudimos guardar el borrador. Tus cambios siguen aquí; vuelve a intentarlo.',
      });
      setPhase('editing');
    } finally {
      pending.current = false;
    }
  }

  return (
    <View style={styles.form}>
      <Text accessibilityRole="header" style={styles.heading}>
        Observación de terreno
      </Text>
      <Text style={styles.label}>Lago seleccionado</Text>
      <Text
        accessibilityLabel={`Lago seleccionado: ${lakeName}`}
        style={styles.lake}
      >
        {lakeName}
      </Text>
      <Text style={styles.muted}>
        Borrador local · Pendiente de envío y validación. Una observación o
        fotografía no constituye una medición validada.
      </Text>
      <DraftStatus phase={phase} savedAt={savedAt} durability={durability} />
      <View style={styles.field}>
        <Text nativeID="observation-date-label" style={styles.label}>
          Fecha y hora de la observación
        </Text>
        <TextInput
          accessibilityLabel="Fecha y hora de la observación"
          accessibilityLabelledBy="observation-date-label"
          aria-invalid={Boolean(errors.date)}
          accessibilityState={{ disabled: isSaving }}
          editable={!isSaving}
          autoCorrect={false}
          placeholder="AAAA-MM-DD HH:mm"
          value={dateText}
          onChangeText={(value) => {
            setDateText(value);
            setPhase('editing');
            setErrors({});
          }}
          style={[styles.input, errors.date && styles.invalid]}
        />
        <Text style={styles.muted}>
          Hora local del dispositivo; se conserva como fecha UTC al guardar.
        </Text>
        {errors.date ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {errors.date}
          </Text>
        ) : null}
      </View>
      <View style={styles.field}>
        <Text nativeID="observation-note-label" style={styles.label}>
          Nota de terreno
        </Text>
        <Text style={styles.muted}>Opcional; hasta 2000 caracteres.</Text>
        <TextInput
          accessibilityLabel="Nota de terreno"
          accessibilityLabelledBy="observation-note-label"
          aria-invalid={Boolean(errors.note)}
          accessibilityState={{ disabled: isSaving }}
          editable={!isSaving}
          multiline
          value={note}
          onChangeText={(value) => {
            setNote(value);
            setPhase('editing');
            setErrors({});
          }}
          style={[styles.input, styles.note, errors.note && styles.invalid]}
        />
        <Text style={styles.muted}>{note.length} / 2000 caracteres</Text>
        {errors.note ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {errors.note}
          </Text>
        ) : null}
      </View>
      <View style={styles.reserved}>
        <Text accessibilityRole="header" style={styles.label}>
          Ubicación y fotografía
        </Text>
        <Text style={styles.muted}>
          Captura disponible en la semana 2. Puedes guardar este borrador
          incompleto y continuarlo después.
        </Text>
        <AppButton disabled variant="secondary" onPress={() => {}}>
          Capturar ubicación (próximamente)
        </AppButton>
        <AppButton disabled variant="secondary" onPress={() => {}}>
          Tomar fotografía (próximamente)
        </AppButton>
      </View>
      {errors.save ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {errors.save}
        </Text>
      ) : null}
      <AppButton
        disabled={isSaving || phase === 'saved'}
        accessibilityHint="Conserva un borrador local incompleto sin enviarlo al servidor"
        onPress={() => void save()}
      >
        {isSaving ? 'Guardando…' : 'Guardar borrador local'}
      </AppButton>
      <AppButton disabled variant="secondary" onPress={() => {}}>
        Finalizar observación
      </AppButton>
      <Text style={styles.muted}>
        Para finalizar faltan ubicación y fotografía. El guardado local no envía
        ni valida datos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: tokens.spacing.md },
  field: { gap: tokens.spacing.sm },
  heading: { color: tokens.colors.text, fontSize: 20, fontWeight: '700' },
  label: { color: tokens.colors.text, fontWeight: '600', fontSize: 16 },
  lake: { color: tokens.colors.primary, fontSize: 18, fontWeight: '700' },
  muted: { color: tokens.colors.muted, lineHeight: 22 },
  input: {
    minHeight: 48,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius,
    backgroundColor: tokens.colors.surface,
    color: tokens.colors.text,
    fontSize: 16,
  },
  note: { minHeight: 112, textAlignVertical: 'top' },
  invalid: { borderColor: tokens.colors.error },
  error: { color: tokens.colors.error },
  reserved: {
    gap: tokens.spacing.sm,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
});
