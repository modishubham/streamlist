import React, {useMemo} from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type {Movie} from '../../api/types';
import {colors} from '../../theme/colors';
import {radius, spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {getImageUrl} from '../../utils/image';

const POSTER_ASPECT = 2 / 3;

interface HeroFeaturedCardProps {
  movie: Movie;
  cardWidth: number;
  onWatchNow: () => void;
  onDetails: () => void;
}

function HeroFeaturedCard({
  movie,
  cardWidth,
  onWatchNow,
  onDetails,
}: HeroFeaturedCardProps) {
  const uri = useMemo(() => {
    const poster = getImageUrl(movie.poster_path, 'w780');
    if (poster) {
      return poster;
    }
    return getImageUrl(movie.backdrop_path, 'w780');
  }, [movie.backdrop_path, movie.poster_path]);

  const heroRadius = spacing.lg;
  const posterHeight = cardWidth / POSTER_ASPECT;

  return (
    <View style={[styles.wrap, {width: cardWidth}]}>
      <View style={[styles.card, {borderRadius: heroRadius}]}>
        {uri ? (
          <ImageBackground
            source={{uri}}
            style={[styles.poster, {height: posterHeight}]}
            imageStyle={[
              styles.posterImage,
              {
                borderRadius: heroRadius,
              },
            ]}
            resizeMode="cover">
            <LinearGradient
              colors={[
                colors.hero_scrim_soft,
                'transparent',
                colors.hero_scrim_strong,
              ]}
              locations={[0, 0.5, 1]}
              style={[StyleSheet.absoluteFill, {borderRadius: heroRadius}]}
            />
            <View style={styles.content}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>NEW RELEASE</Text>
              </View>
              <Text style={styles.title} numberOfLines={2}>
                {movie.title.toUpperCase()}
              </Text>
              <Text style={styles.synopsis} numberOfLines={2}>
                {movie.overview || ' '}
              </Text>
              <View style={styles.actions}>
                <Pressable
                  onPress={onWatchNow}
                  style={({pressed}) => [
                    styles.heroActionWrap,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Watch now">
                  <LinearGradient
                    colors={['#FFB3AE', '#FF5351']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={styles.heroWatchGradient}>
                    <Icon
                      name="play-arrow"
                      size={22}
                      color={colors.on_primary_cta}
                    />
                    <Text style={styles.watchText}>Watch Now</Text>
                  </LinearGradient>
                </Pressable>
                <Pressable
                  onPress={onDetails}
                  style={({pressed}) => [
                    styles.detailsBtn,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Details">
                  <Text style={styles.detailsText}>Details</Text>
                </Pressable>
              </View>
            </View>
          </ImageBackground>
        ) : (
          <View
            style={[
              styles.poster,
              styles.placeholder,
              {height: posterHeight, borderRadius: heroRadius},
            ]}>
            <Icon name="movie" size={48} color={colors.on_surface_variant} />
            <View style={[styles.content, styles.contentPlaceholder]}>
              <Text style={styles.title} numberOfLines={2}>
                {movie.title.toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    marginTop: spacing.lg,
  },
  card: {
    overflow: 'hidden',
    backgroundColor: colors.surface_container_low,
  },
  poster: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface_container_high,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  contentPlaceholder: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary_container,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
  },
  badgeText: {
    ...typography.label_sm,
    color: colors.on_surface,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title: {
    ...typography.display_md,
    color: colors.on_surface,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  synopsis: {
    ...typography.body_md,
    color: colors.on_surface_muted,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  /** Matches DetailScreen watchlist CTA: fixed height + corner radius. */
  heroActionWrap: {
    flex: 1,
  },
  heroWatchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: spacing['4xl'],
    borderRadius: spacing.xs,
  },
  watchText: {
    ...typography.title_sm,
    color: colors.on_primary_cta,
  },
  detailsBtn: {
    flex: 1,
    height: spacing['4xl'],
    paddingHorizontal: spacing.md,
    borderRadius: spacing.xs,
    backgroundColor: colors.details_button_background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsText: {
    ...typography.title_sm,
    color: colors.on_surface,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default React.memo(HeroFeaturedCard);
