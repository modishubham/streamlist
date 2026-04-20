import React, {useMemo} from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {HOME_HEADER_CONTENT_HEIGHT} from '../home/homeLayout';
import SkeletonBox from './SkeletonBox';
import SkeletonPosterCard from './SkeletonPosterCard';
import {colors} from '../../theme/colors';
import {radius, spacing} from '../../theme/spacing';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const HERO_WIDTH = SCREEN_WIDTH - spacing.md * 2;
const POSTER_ASPECT = 2 / 3;
const HERO_HEIGHT = HERO_WIDTH / POSTER_ASPECT;
const CHIP_COUNT = 6;
/** Match visible posters in a horizontal row (~2 per screen). */
const ROW_CARD_COUNT = 2;

function HomeScreenSkeleton() {
  const insets = useSafeAreaInsets();
  const cardWidth = useMemo(() => {
    const gap = spacing.md;
    const pad = spacing.md * 2;
    return (SCREEN_WIDTH - pad - gap) / 2;
  }, []);

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
          borderRadius={spacing.lg}
          style={styles.hero}
        />

        {Array.from({length: 3}).map((_, sectionIdx) => (
          <View key={sectionIdx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <SkeletonBox
                width={SCREEN_WIDTH * 0.42}
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
    paddingHorizontal: spacing.md,
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

export default React.memo(HomeScreenSkeleton);
