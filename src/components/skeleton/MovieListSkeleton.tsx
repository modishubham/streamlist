import React, {useMemo} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import SkeletonPosterCard from './SkeletonPosterCard';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

const MAX_CARD_WIDTH = 400;
const ROW_COUNT = 5;

function MovieListSkeleton() {
  const {width: windowWidth} = useWindowDimensions();

  const cardWidth = useMemo(
    () => Math.min(windowWidth - spacing.md * 2, MAX_CARD_WIDTH),
    [windowWidth],
  );

  return (
    <View
      style={styles.container}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      {Array.from({length: ROW_COUNT}).map((_, i) => (
        <View key={i} style={i > 0 ? styles.sep : undefined}>
          <View style={styles.cardWrap}>
            <SkeletonPosterCard width={cardWidth} />
          </View>
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
  cardWrap: {
    alignItems: 'center',
  },
  sep: {
    marginTop: spacing.md,
  },
});

export default React.memo(MovieListSkeleton);
