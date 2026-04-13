import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import type {GenreChipOption} from '../../utils/displayGenres';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.lg,
  },
  chipActive: {
    backgroundColor: colors.primary_container,
  },
  chipInactive: {
    backgroundColor: colors.chip_inactive_background,
  },
  chipText: {
    ...typography.title_sm,
  },
  chipTextActive: {
    color: colors.on_surface,
  },
  chipTextInactive: {
    color: colors.on_surface_muted,
  },
});

export default React.memo(GenreChipStrip);
