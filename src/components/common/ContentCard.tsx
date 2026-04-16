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
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {getImageUrl} from '../../utils/image';

interface ContentCardProps {
  posterPath: string | null;
  title: string;
  subtitle?: string;
  rating?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

const ASPECT_RATIO = 2 / 3;

function ContentCard({
  posterPath,
  title,
  subtitle,
  rating,
  onPress,
  style,
}: ContentCardProps) {
  const imageUri = getImageUrl(posterPath, 'w500');

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [styles.container, pressed && styles.pressed, style]}
      accessibilityRole="button"
      accessibilityLabel={title}>
      <View style={styles.imageWrapper}>
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
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container,
    overflow: 'hidden',
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
    borderRadius: spacing.sm,
  },
  ratingText: {
    ...typography.label_sm,
    color: colors.on_surface,
  },
  title: {
    ...typography.title_sm,
    color: colors.on_surface,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.label_sm,
    color: colors.on_surface_variant,
    marginTop: spacing.xxs,
  },
});

export default React.memo(ContentCard);
