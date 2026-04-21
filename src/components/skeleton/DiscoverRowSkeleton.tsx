import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import SkeletonBox from './SkeletonBox';
import SkeletonPosterCard from './SkeletonPosterCard';
import {radius, spacing, stitchLayout} from '../../theme/spacing';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const ROW_CARD_COUNT = 3;

function DiscoverRowSkeleton() {
  const cardWidth = stitchLayout.posterWidth;

  return (
    <View
      style={styles.section}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <View style={styles.sectionHeader}>
        <SkeletonBox
          width={SCREEN_WIDTH * 0.38}
          height={spacing.lg}
          borderRadius={radius.stitchLg}
        />
        <SkeletonBox
          width={spacing['3xl']}
          height={spacing.md}
          borderRadius={radius.stitchLg}
        />
      </View>
      <View style={styles.horizontalRow}>
        {Array.from({length: ROW_CARD_COUNT}).map((_, j) => (
          <View key={j} style={j > 0 ? styles.cardGap : undefined}>
            <SkeletonPosterCard width={cardWidth} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: stitchLayout.screenGutter,
    marginBottom: spacing.sm,
  },
  horizontalRow: {
    flexDirection: 'row',
    paddingHorizontal: stitchLayout.screenGutter,
  },
  cardGap: {
    marginLeft: stitchLayout.posterRowGap,
  },
});

export default React.memo(DiscoverRowSkeleton);
