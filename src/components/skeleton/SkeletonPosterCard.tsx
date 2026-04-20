import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonBox from './SkeletonBox';
import {spacing} from '../../theme/spacing';

const POSTER_ASPECT = 2 / 3;

interface SkeletonPosterCardProps {
  width: number;
}

/**
 * Matches {@link ContentCard} layout: poster + title + subtitle bars.
 */
function SkeletonPosterCard({width}: SkeletonPosterCardProps) {
  const posterHeight = width / POSTER_ASPECT;

  return (
    <View style={[styles.wrap, {width}]}>
      <SkeletonBox
        width={width}
        height={posterHeight}
        borderRadius={spacing.sm}
      />
      <SkeletonBox
        width={width * 0.88}
        height={spacing.sm}
        borderRadius={spacing.xxs}
        style={styles.titleBar}
      />
      <SkeletonBox
        width={width * 0.55}
        height={spacing.xs}
        borderRadius={spacing.xxs}
        style={styles.subtitleBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexShrink: 1,
  },
  titleBar: {
    marginTop: spacing.sm,
  },
  subtitleBar: {
    marginTop: spacing.xxs,
  },
});

export default React.memo(SkeletonPosterCard);
