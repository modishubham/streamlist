import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import type {GenreChipOption} from '../../utils/displayGenres';
import {colors} from '../../theme/colors';
import {radius, spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

interface GenreChipStripProps {
  options: GenreChipOption[];
  selectedId: number | null;
  onSelect: (chip: GenreChipOption) => void;
}

function GenreChipStrip({options, selectedId, onSelect}: GenreChipStripProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {options.map(chip => {
        const active =
          chip.id === null ? selectedId === null : selectedId === chip.id;
        return (
          <Pressable
            key={chip.id === null ? 'all' : String(chip.id)}
            onPress={() => onSelect(chip)}
            style={[
              styles.chip,
              active ? styles.chipActive : styles.chipInactive,
            ]}
            accessibilityRole="button"
            accessibilityState={{selected: active}}
            accessibilityLabel={chip.label}>
            <Text
              style={[
                styles.chipText,
                active ? styles.chipTextActive : styles.chipTextInactive,
              ]}>
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  chipActive: {
    backgroundColor: colors.genre_chip_active_background,
  },
  chipInactive: {
    backgroundColor: colors.search_field_background,
  },
  chipText: {
    ...typography.chip_label,
  },
  chipTextActive: {
    color: colors.on_surface,
  },
  chipTextInactive: {
    color: colors.chip_inactive_text,
  },
});

export default React.memo(GenreChipStrip);
