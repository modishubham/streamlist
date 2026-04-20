import React, {useMemo} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import SkeletonPosterCard from './SkeletonPosterCard';
import {spacing} from '../../theme/spacing';

const CARD_COUNT = 4;
const H_PADDING = spacing.md;

/**
 * Compact horizontal skeleton for infinite-scroll footers (home + movie list).
 */
function SkeletonFooterStrip() {
  const {width: windowWidth} = useWindowDimensions();

  const cardWidth = useMemo(() => {
    const totalGap = spacing.md * (CARD_COUNT - 1);
    const available = windowWidth - H_PADDING * 2 - totalGap;
    return Math.max(spacing['4xl'], Math.floor(available / CARD_COUNT));
  }, [windowWidth]);

  return (
    <View
      style={styles.row}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      {Array.from({length: CARD_COUNT}).map((_, i) => (
        <View key={i} style={i > 0 ? styles.gap : undefined}>
          <SkeletonPosterCard width={cardWidth} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: spacing.xl,
    paddingHorizontal: H_PADDING,
  },
  gap: {
    marginLeft: spacing.md,
  },
});

export default React.memo(SkeletonFooterStrip);
