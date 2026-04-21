import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import type {GenreChipOption} from '../../utils/displayGenres';
import {colors} from '../../theme/colors';
import {radius, spacing, stitchLayout} from '../../theme/spacing';
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
              !active && styles.chipInactiveBorder,
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
    paddingHorizontal: stitchLayout.screenGutter,
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.xl,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  chipActive: {
    backgroundColor: colors.genre_chip_active_background,
  },
  chipInactive: {
    backgroundColor: colors.surface_container_low,
  },
  chipInactiveBorder: {
    borderWidth: 1,
    borderColor: colors.chip_inactive_border,
  },
  chipText: {
    ...typography.home_genre_chip,
  },
  chipTextActive: {
    color: colors.on_surface,
  },
  /** Stitch: inactive pills use `text-on-surface-variant`, not primary tint. */
  chipTextInactive: {
    color: colors.on_surface_variant,
  },
});

export default React.memo(GenreChipStrip);
