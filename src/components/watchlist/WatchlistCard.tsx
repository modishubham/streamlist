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
import type {Movie} from '../../api/types';
import {colors} from '../../theme/colors';
import {radius, spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {getImageUrl} from '../../utils/image';

interface WatchlistCardProps {
  movie: Movie;
  /** Resolved genre name strings for this movie (pass empty array if unavailable). */
  genreNames: string[];
  onRemove: () => void;
  onDetails: () => void;
  style?: ViewStyle;
}

function WatchlistCard({
  movie,
  genreNames,
  onRemove,
  onDetails,
  style,
}: WatchlistCardProps) {
  const imageUri = getImageUrl(movie.poster_path, 'w342');
  const year = movie.release_date?.slice(0, 4) ?? '';
  const genreLabel = genreNames.slice(0, 2).join(' / ');
  const meta = [year, genreLabel].filter(Boolean).join(' • ');

  return (
    <View style={[styles.container, style]}>
      {/* ─── Poster (rating only on image — no remove control here) ─ */}
      <View style={styles.posterWrapper}>
        {imageUri ? (
          <Image
            source={{uri: imageUri}}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Icon name="movie" size={32} color={colors.on_surface_variant} />
          </View>
        )}

        {movie.vote_average > 0 && (
          <View style={styles.ratingBadge}>
            <Icon name="star" size={10} color={colors.primary_container} />
            <Text style={styles.ratingText}>
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {movie.title}
          </Text>
          <Pressable
            onPress={onRemove}
            style={({pressed}) => [
              styles.removeBtn,
              pressed && styles.removeBtnPressed,
            ]}
            hitSlop={spacing.xs}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${movie.title} from watchlist`}>
            <Icon name="close" size={16} color={colors.on_surface} />
          </Pressable>
        </View>

        {meta ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}

        <Pressable
          onPress={onDetails}
          style={({pressed}) => [
            styles.detailsBtn,
            pressed && styles.detailsBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${movie.title}`}>
          <Text style={styles.detailsText}>Details</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    backgroundColor: colors.surface_container,
    borderRadius: spacing.lg,
    overflow: 'hidden',
  },
  posterWrapper: {
    aspectRatio: 2 / 3,
    width: '100%',
    backgroundColor: colors.surface_container_low,
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
  cardBody: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    flex: 1,
    ...typography.title_lg,
    color: colors.on_surface,
  },
  removeBtn: {
    padding: spacing.xxs,
    borderRadius: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnPressed: {
    backgroundColor: colors.surface_bright,
  },
  subtitle: {
    marginTop: spacing.xxs,
    ...typography.label_sm,
    color: colors.on_surface_variant,
  },
  detailsBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface_container_highest,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnPressed: {
    backgroundColor: colors.surface_bright,
  },
  detailsText: {
    ...typography.title_sm,
    color: colors.on_surface,
  },
});

export default React.memo(WatchlistCard);
