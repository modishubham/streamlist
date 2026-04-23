import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {HOME_HEADER_CONTENT_HEIGHT} from '../home/homeLayout';
import SkeletonBox from './SkeletonBox';
import SkeletonPosterCard from './SkeletonPosterCard';
import {colors} from '../../theme/colors';
import {homeRowCardDimensions, radius, spacing, stitchLayout} from '../../theme/spacing';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const HERO_WIDTH = SCREEN_WIDTH - stitchLayout.screenGutter * 2;
const HERO_HEIGHT = stitchLayout.heroBandHeight;
const CHIP_COUNT = 6;
/** Match visible posters in a horizontal row (two per viewport, Stitch). */
const ROW_CARD_COUNT = 2;

function HomeScreenSkeleton() {
  const insets = useSafeAreaInsets();
  const {width: cardWidth} = homeRowCardDimensions(SCREEN_WIDTH);

  const contentTop = insets.top + HOME_HEADER_CONTENT_HEIGHT + spacing.md;

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingTop: contentTop, paddingBottom: spacing['3xl']},
        ]}>
        <View style={styles.chipRow}>
          {Array.from({length: CHIP_COUNT}).map((_, i) => (
            <SkeletonBox
              key={i}
              width={i % 3 === 0 ? spacing['4xl'] : spacing['3xl']}
              height={spacing['2xl']}
              borderRadius={radius.pill}
            />
          ))}
        </View>

        <SkeletonBox
          width={HERO_WIDTH}
          height={HERO_HEIGHT}
          borderRadius={radius.stitchXl}
          style={styles.hero}
        />

        {Array.from({length: 3}).map((_, sectionIdx) => (
          <View key={sectionIdx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <SkeletonBox
                width={SCREEN_WIDTH * 0.42}
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
              {Array.from({length: ROW_CARD_COUNT}).map((__, j) => (
                <View key={j} style={j > 0 ? styles.cardGap : undefined}>
                  <SkeletonPosterCard width={cardWidth} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: stitchLayout.screenGutter,
    marginBottom: spacing.md,
  },
  hero: {
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
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

export default React.memo(HomeScreenSkeleton);
