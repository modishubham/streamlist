import React, {useMemo} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import SkeletonPosterCard from './SkeletonPosterCard';
import {spacing} from '../../theme/spacing';

const NUM_COLUMNS = 2;
const CARD_GAP = spacing.md;
const PLACEHOLDER_ROWS = 4;

interface SearchGridSkeletonProps {
  /** Include top padding for search results area under header. */
  paddingTop?: number;
}

function SearchGridSkeleton({paddingTop = 0}: SearchGridSkeletonProps) {
  const {width: windowWidth} = useWindowDimensions();

  const cardWidth = useMemo(
    () =>
      (windowWidth - spacing.md * 2 - CARD_GAP * (NUM_COLUMNS - 1)) /
      NUM_COLUMNS,
    [windowWidth],
  );

  return (
    <View
      style={[styles.grid, paddingTop ? {paddingTop} : undefined]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      {Array.from({length: PLACEHOLDER_ROWS}).map((_, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          <SkeletonPosterCard width={cardWidth} />
          <View style={styles.gap} />
          <SkeletonPosterCard width={cardWidth} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  gap: {
    width: CARD_GAP,
  },
});

export default React.memo(SearchGridSkeleton);
