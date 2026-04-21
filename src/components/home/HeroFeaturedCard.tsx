import React, {useMemo} from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type {Movie} from '../../api/types';
import {colors} from '../../theme/colors';
import {radius, spacing, stitchLayout} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {getImageUrl} from '../../utils/image';

const HERO_H = stitchLayout.heroBandHeight;
const HERO_R = radius.stitchXl;
/** Stitch hero CTAs: `px-8 py-3 rounded-lg`. */
const CTA_PAD_H = stitchLayout.screenGutter;
const CTA_PAD_V = 12;

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

  return (
    <View style={[styles.wrap, {width: cardWidth}]}>
      <View
        style={[
          styles.card,
          {width: cardWidth, height: HERO_H, borderRadius: HERO_R},
        ]}>
        {uri ? (
          <ImageBackground
            source={{uri}}
            style={[styles.poster, {borderRadius: HERO_R}]}
            imageStyle={[styles.posterImage, {borderRadius: HERO_R}]}
            resizeMode="cover">
            <LinearGradient
              colors={[
                colors.hero_scrim_soft,
                'transparent',
                colors.hero_scrim_strong,
              ]}
              locations={[0, 0.5, 1]}
              style={[StyleSheet.absoluteFill, {borderRadius: HERO_R}]}
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
                  <View style={styles.watchSolid}>
                    <Icon
                      name="play-arrow"
                      size={20}
                      color={colors.on_primary}
                    />
                    <Text style={styles.watchText}>Watch Now</Text>
                  </View>
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
              styles.placeholder,
              {height: HERO_H, borderRadius: HERO_R},
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
    backgroundColor: colors.surface_container_lowest,
  },
  poster: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  posterImage: {
    opacity: 0.6,
  },
  placeholder: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface_container_high,
  },
  content: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    padding: spacing['3xl'],
    paddingBottom: spacing['2xl'],
  },
  contentPlaceholder: {
    backgroundColor: 'transparent',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary_container,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    borderRadius: radius.stitchXs,
    marginBottom: spacing.md,
  },
  badgeText: {
    ...typography.home_hero_badge,
    color: colors.on_primary_container,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.home_hero_title,
    color: colors.on_surface,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  synopsis: {
    ...typography.home_hero_synopsis,
    color: colors.on_surface_variant,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.md,
  },
  heroActionWrap: {
    flex: 1,
  },
  /** Stitch: `bg-primary text-on-primary px-8 py-3 rounded-lg font-bold` */
  watchSolid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: CTA_PAD_H,
    paddingVertical: CTA_PAD_V,
    borderRadius: radius.stitchLg,
    backgroundColor: colors.primary,
  },
  watchText: {
    ...typography.home_hero_cta,
    color: colors.on_primary,
  },
  /** Stitch: `bg-surface-container-highest/80 … border border-white/5` + same padding as primary */
  detailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: CTA_PAD_H,
    paddingVertical: CTA_PAD_V,
    borderRadius: radius.stitchLg,
    backgroundColor: 'rgba(53, 53, 52, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailsText: {
    ...typography.home_hero_cta,
    color: colors.on_surface,
  },
  pressed: {
    opacity: 0.88,
  },
});

export default React.memo(HeroFeaturedCard);
