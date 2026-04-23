import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../theme/colors';
import {radius, spacing, stitchLayout} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {getImageUrl} from '../../utils/image';

interface ContentCardProps {
  posterPath: string | null;
  title: string;
  subtitle?: string;
  rating?: number;
  onPress?: () => void;
  style?: ViewStyle;
  /** Stitch home row: 2:3 poster + 12px corners. Height defaults from `stitchLayout`. */
  layoutVariant?: 'default' | 'stitch';
  /** When `layoutVariant` is `stitch`, overrides `stitchLayout.posterHeight`. */
  stitchImageHeight?: number;
}

const ASPECT_RATIO = 2 / 3;

function ContentCard({
  posterPath,
  title,
  subtitle,
  rating,
  onPress,
  style,
  layoutVariant = 'default',
  stitchImageHeight,
}: ContentCardProps) {
  const imageUri = getImageUrl(posterPath, 'w500');
  const stitchPoster = layoutVariant === 'stitch';
  const stitchHeightOverride =
    stitchPoster && stitchImageHeight !== undefined
      ? {height: stitchImageHeight}
      : null;

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [styles.container, pressed && styles.pressed, style]}
      accessibilityRole="button"
      accessibilityLabel={title}>
      <View
        style={[
          styles.imageWrapper,
          stitchPoster && styles.imageWrapperStitch,
          stitchHeightOverride,
        ]}>
        {imageUri ? (
          <Image source={{uri: imageUri}} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Icon name="movie" size={32} color={colors.on_surface_variant} />
          </View>
        )}
        {rating !== undefined && (
          <View style={styles.ratingBadge}>
            <Icon
              name="star"
              size={12}
              color={colors.primary_container}
            />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  imageWrapper: {
    aspectRatio: ASPECT_RATIO,
    borderRadius: radius.stitchXl,
    backgroundColor: colors.surface_container_low,
    overflow: 'hidden',
  },
  imageWrapperStitch: {
    aspectRatio: undefined,
    height: stitchLayout.posterHeight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: colors.surface_container_highest,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: radius.stitchXs,
  },
  ratingText: {
    ...typography.label_sm,
    color: colors.on_surface,
  },
  title: {
    ...typography.home_card_title,
    color: colors.on_surface,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.home_card_meta,
    color: colors.on_surface_variant,
    marginTop: spacing.xxs,
  },
});

export default React.memo(ContentCard);
