import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import SkeletonBox from './SkeletonBox';
import SkeletonPosterCard from './SkeletonPosterCard';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const BACKDROP_HEIGHT = 220;
const CAST_SIZE = 64;
const SIMILAR_CARD_WIDTH =
  (SCREEN_WIDTH - spacing.xl * 2 - spacing.md * 2) / 2.5;

function DetailScreenSkeleton() {
  return (
    <View
      style={styles.root}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <SkeletonBox
          width={SCREEN_WIDTH}
          height={BACKDROP_HEIGHT}
          borderRadius={0}
        />

        <SkeletonBox
          width={SCREEN_WIDTH * 0.82}
          height={spacing['3xl']}
          borderRadius={spacing.sm}
          style={styles.title}
        />

        <View style={styles.chipsRow}>
          {[0, 1, 2].map(i => (
            <SkeletonBox
              key={i}
              width={spacing['4xl'] + i * spacing.md}
              height={spacing.lg}
              borderRadius={spacing.xs}
            />
          ))}
        </View>

        <SkeletonBox
          width={SCREEN_WIDTH - spacing.xl * 2}
          height={spacing['4xl']}
          borderRadius={spacing.xs}
          style={styles.watchlist}
        />

        <View style={styles.synopsis}>
          <SkeletonBox
            width={spacing['3xl']}
            height={spacing.md}
            borderRadius={spacing.xs}
            style={styles.synopsisTitle}
          />
          {[0, 1, 2, 3].map(i => (
            <SkeletonBox
              key={i}
              width={i === 3 ? SCREEN_WIDTH * 0.55 : SCREEN_WIDTH - spacing.xl * 2}
              height={spacing.sm}
              borderRadius={spacing.xxs}
              style={styles.synopsisLine}
            />
          ))}
        </View>

        <SkeletonBox
          width={spacing['4xl']}
          height={spacing.lg}
          borderRadius={spacing.xs}
          style={styles.castHeading}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.castRow}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={i > 0 ? styles.castGap : undefined}>
              <SkeletonBox
                width={CAST_SIZE}
                height={CAST_SIZE}
                borderRadius={CAST_SIZE / 2}
              />
              <SkeletonBox
                width={CAST_SIZE}
                height={spacing.xs}
                borderRadius={spacing.xxs}
                style={styles.castName}
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.similarHeader}>
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.similarRow}>
          {[0, 1, 2].map(i => (
            <View key={i} style={i > 0 ? styles.similarGap : undefined}>
              <SkeletonPosterCard width={SIMILAR_CARD_WIDTH} />
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingBottom: spacing['4xl'],
  },
  title: {
    marginTop: -spacing['2xl'],
    marginHorizontal: spacing.xl,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  watchlist: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  synopsis: {
    marginBottom: spacing['3xl'],
    paddingHorizontal: spacing.xl,
  },
  synopsisTitle: {
    marginBottom: spacing.sm,
  },
  synopsisLine: {
    marginTop: spacing.sm,
  },
  castHeading: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  castRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing['3xl'],
  },
  castGap: {
    marginLeft: spacing.xl,
  },
  castName: {
    marginTop: spacing.xs,
  },
  similarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  similarRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    alignItems: 'flex-start',
  },
  similarGap: {
    marginLeft: spacing.md,
  },
});

export default React.memo(DetailScreenSkeleton);
