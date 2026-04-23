import React, {useMemo} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import SkeletonPosterCard from './SkeletonPosterCard';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

const NUM_COLUMNS = 2;
const CARD_GAP = spacing.md;
const PLACEHOLDER_ROWS = 5;

function MovieListSkeleton() {
  const {width: windowWidth} = useWindowDimensions();

  const cardWidth = useMemo(
    () =>
      (windowWidth - spacing.md * 2 - CARD_GAP * (NUM_COLUMNS - 1)) /
      NUM_COLUMNS,
    [windowWidth],
  );

  return (
    <View
      style={styles.container}
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
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    paddingBottom: spacing['3xl'],
  },
  row: {
    flexDirection: 'row',
    marginBottom: CARD_GAP,
  },
  gap: {
    width: CARD_GAP,
  },
});

export default React.memo(MovieListSkeleton);
