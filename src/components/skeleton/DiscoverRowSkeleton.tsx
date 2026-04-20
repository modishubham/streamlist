import React, {useMemo} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import SkeletonBox from './SkeletonBox';
import SkeletonPosterCard from './SkeletonPosterCard';
import {spacing} from '../../theme/spacing';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const ROW_CARD_COUNT = 2;

function DiscoverRowSkeleton() {
  const cardWidth = useMemo(() => {
    const gap = spacing.md;
    const pad = spacing.md * 2;
    return (SCREEN_WIDTH - pad - gap) / 2;
  }, []);

  return (
    <View
      style={styles.section}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <View style={styles.sectionHeader}>
        <SkeletonBox
          width={SCREEN_WIDTH * 0.38}
          height={spacing.lg}
          borderRadius={spacing.xs}
        />
        <SkeletonBox
          width={spacing['3xl']}
          height={spacing.md}
          borderRadius={spacing.xs}
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
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  horizontalRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
  },
  cardGap: {
    marginLeft: spacing.md,
  },
});

export default React.memo(DiscoverRowSkeleton);
