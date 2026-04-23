import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  type TextLayoutEventData,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicon from 'react-native-vector-icons/Ionicons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/types';
import {useMovieDetail} from '../hooks/useMovieDetail';
import {useWatchlistStore} from '../store/watchlistStore';
import ContentCard from '../components/common/ContentCard';
import DetailScreenSkeleton from '../components/skeleton/DetailScreenSkeleton';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import {getImageUrl} from '../utils/image';
import type {CastMember, Movie, MovieDetail} from '../api/types';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const BACKDROP_HEIGHT = 220;
const CAST_AVATAR_SIZE = 64;
const HEADER_ICON_SIZE = 40;
const SIMILAR_CARD_WIDTH =
  (SCREEN_WIDTH - spacing.xl * 2 - spacing.md * 2) / 2.5;

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

function toMovie(detail: MovieDetail): Movie {
  return {
    id: detail.id,
    title: detail.title,
    overview: detail.overview,
    poster_path: detail.poster_path,
    backdrop_path: detail.backdrop_path,
    release_date: detail.release_date,
    vote_average: detail.vote_average,
    vote_count: detail.vote_count,
    genre_ids: detail.genres.map(g => g.id),
    popularity: detail.popularity,
    original_language: detail.original_language,
    adult: detail.adult,
  };
}

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) {
    return `${m}m`;
  }
  if (m === 0) {
    return `${h}h`;
  }
  return `${h}h ${m}m`;
}

interface ChipData {
  key: string;
  label: string;
  isRating?: boolean;
}

function MetadataChips({detail}: {detail: MovieDetail}) {
  const chips: ChipData[] = [];

  const year = detail.release_date?.slice(0, 4);
  if (year) {
    chips.push({key: 'year', label: year});
  }

  if (detail.vote_average && detail.vote_average > 0) {
    chips.push({
      key: 'rating',
      label: `${detail.vote_average.toFixed(1)} Rating`,
      isRating: true,
    });
  }

  const genre = detail.genres?.[0]?.name;
  if (genre) {
    chips.push({key: 'genre', label: genre});
  }

  if (detail.runtime && detail.runtime > 0) {
    chips.push({key: 'runtime', label: formatRuntime(detail.runtime)});
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <View style={styles.chipsRow}>
      {chips.map(chip => (
        <View
          key={chip.key}
          style={[styles.chip, chip.isRating && styles.ratingChip]}>
          {chip.isRating && (
            <Ionicon name="star" size={14} color={colors.primary_cta} />
          )}
          <Text
            style={[
              styles.chipText,
              chip.isRating && styles.ratingChipText,
            ]}>
            {chip.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function WatchlistButton({detail}: {detail: MovieDetail}) {
  const inWatchlist = useWatchlistStore(s => s.isInWatchlist(detail.id));
  const addToWatchlist = useWatchlistStore(s => s.addToWatchlist);
  const removeFromWatchlist = useWatchlistStore(s => s.removeFromWatchlist);

  const handleToggle = useCallback(() => {
    if (inWatchlist) {
      removeFromWatchlist(detail.id);
    } else {
      addToWatchlist(toMovie(detail));
    }
  }, [inWatchlist, detail, addToWatchlist, removeFromWatchlist]);

  if (inWatchlist) {
    return (
      <Pressable
        onPress={handleToggle}
        style={({pressed}) => [
          styles.watchlistBtn,
          styles.watchlistBtnAdded,
          pressed && styles.watchlistBtnPressed,
        ]}>
        <Ionicon name="bookmark" size={20} color={colors.primary} />
        <Text style={styles.watchlistTextAdded}>In Watchlist</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handleToggle}
      style={({pressed}) => [pressed && styles.watchlistBtnPressed]}>
      <LinearGradient
        colors={['#FFB3AE', '#FF5351']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.watchlistBtn}>
        <Ionicon name="bookmark-outline" size={20} color={colors.on_primary_cta} />
        <Text style={styles.watchlistTextDefault}>Add to Watchlist</Text>
      </LinearGradient>
    </Pressable>
  );
}

function estimateSynopsisExceedsThreeLines(text: string, bodyWidth: number) {
  const w = bodyWidth > 0 ? bodyWidth : 1;
  /** ~8px per Latin character at body_md; conservative so “Read more” appears when likely >3 lines */
  const charsPerLine = Math.max(18, Math.floor(w / 7.5));
  const lines = Math.ceil(text.trim().length / charsPerLine);
  return lines > 3;
}

function Synopsis({overview}: {overview: string}) {
  const {width: windowWidth} = useWindowDimensions();
  const [expanded, setExpanded] = useState(false);
  const [truncatable, setTruncatable] = useState(false);
  const [measured, setMeasured] = useState(false);
  const [bodyWidth, setBodyWidth] = useState(0);
  const measuredRef = useRef(false);

  const fallbackBodyWidth = Math.max(0, windowWidth - spacing.xl * 2);
  const measureWidth =
    bodyWidth > 0 ? bodyWidth : Math.max(1, fallbackBodyWidth);

  useEffect(() => {
    setExpanded(false);
    setTruncatable(false);
    setMeasured(false);
    measuredRef.current = false;
  }, [overview]);

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const applyMeasureResult = useCallback((lineCount: number) => {
    if (measuredRef.current) {
      return;
    }
    measuredRef.current = true;
    setTruncatable(lineCount > 3);
    setMeasured(true);
  }, []);

  const onMeasureLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      applyMeasureResult(e.nativeEvent.lines.length);
    },
    [applyMeasureResult],
  );

  /** Some platforms skip or defer onTextLayout for invisible/off-flow Text — ensure we still unlock layout + button */
  useEffect(() => {
    if (measuredRef.current) {
      return;
    }
    const id = setTimeout(() => {
      if (measuredRef.current) {
        return;
      }
      measuredRef.current = true;
      setTruncatable(estimateSynopsisExceedsThreeLines(overview, measureWidth));
      setMeasured(true);
    }, 400);
    return () => clearTimeout(id);
  }, [overview, measureWidth]);

  const onSynopsisBodyLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) {
      setBodyWidth(prev => (prev === w ? prev : w));
    }
  }, []);

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  }, []);

  if (!overview) {
    return null;
  }

  return (
    <View style={styles.synopsisSection}>
      <Text style={styles.sectionTitle}>Synopsis</Text>
      <View
        style={styles.synopsisBody}
        onLayout={onSynopsisBodyLayout}
        collapsable={false}>
        {!measured ? (
          <Text
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[
              styles.synopsisText,
              styles.synopsisMeasure,
              {width: measureWidth},
            ]}
            onTextLayout={onMeasureLayout}>
            {overview}
          </Text>
        ) : null}
        <Text
          style={styles.synopsisText}
          numberOfLines={
            !measured ? 3 : truncatable && !expanded ? 3 : undefined
          }>
          {overview}
        </Text>
        {truncatable ? (
          <Pressable
            onPress={toggleExpanded}
            hitSlop={spacing.xs}
            style={styles.readMoreButton}
            accessibilityRole="button"
            accessibilityLabel={expanded ? 'Read less' : 'Read more'}>
            <Text style={styles.readMoreLabel}>
              {expanded ? 'Read less' : 'Read more'}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function CastItem({member}: {member: CastMember}) {
  const imageUri = getImageUrl(member.profile_path, 'w185');

  return (
    <View style={styles.castItem}>
      {imageUri ? (
        <Image source={{uri: imageUri}} style={styles.castAvatar} />
      ) : (
        <View style={[styles.castAvatar, styles.castPlaceholder]}>
          <Ionicon
            name="person"
            size={24}
            color={colors.on_surface_variant}
          />
        </View>
      )}
      <Text style={styles.castName} numberOfLines={1}>
        {member.name}
      </Text>
      {member.character ? (
        <Text style={styles.castCharacter} numberOfLines={1}>
          {member.character}
        </Text>
      ) : null}
    </View>
  );
}

function CastItemSeparator() {
  return <View style={styles.castSeparator} />;
}

function SimilarItemSeparator() {
  return <View style={styles.similarSeparator} />;
}

const castKeyExtractor = (item: CastMember) => String(item.id);
const similarKeyExtractor = (item: Movie) => String(item.id);

export default function DetailScreen({route}: Props) {
  const {movieId} = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {data, loading, error} = useMovieDetail(movieId);

  const openDetail = useCallback(
    (id: number) => {
      navigation.navigate('Detail', {movieId: id});
    },
    [navigation],
  );

  const renderCastItem = useCallback(
    ({item}: {item: CastMember}) => <CastItem member={item} />,
    [],
  );

  const renderSimilarItem = useCallback(
    ({item}: {item: Movie}) => (
      <ContentCard
        posterPath={item.poster_path}
        title={item.title}
        onPress={() => openDetail(item.id)}
        style={similarCardStyle}
      />
    ),
    [openDetail],
  );

  const backdropUri = useMemo(
    () =>
      data?.detail ? getImageUrl(data.detail.backdrop_path, 'w780') : null,
    [data?.detail],
  );

  if (loading) {
    return (
      <View style={styles.root}>
        <DetailScreenSkeleton />
        <View style={[styles.header, {paddingTop: insets.top}]}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={spacing.xs}
            style={styles.headerIcon}>
            <Ionicon
              name="arrow-back"
              size={spacing.xl}
              color={colors.on_surface}
            />
          </Pressable>
          <Pressable hitSlop={spacing.xs} style={styles.headerIcon}>
            <Ionicon
              name="share-outline"
              size={spacing.xl}
              color={colors.on_surface}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  if (error || !data?.detail) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? 'Movie not found'}</Text>
      </View>
    );
  }

  const {detail, cast, similar} = data;

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Backdrop hero */}
        <View style={styles.backdropContainer}>
          {backdropUri ? (
            <Image source={{uri: backdropUri}} style={styles.backdropImage} />
          ) : (
            <View style={styles.backdropPlaceholder}>
              <Ionicon
                name="film-outline"
                size={spacing['4xl']}
                color={colors.on_surface_variant}
              />
            </View>
          )}
          {/* bottom fade into surface */}
          <LinearGradient
            colors={['transparent', colors.surface]}
            locations={[0.4, 1.0]}
            style={StyleSheet.absoluteFill}
          />
          {/* top scrim so header icons stay readable */}
          <LinearGradient
            colors={['rgba(0,0,0,0.55)', 'transparent']}
            locations={[0.0, 0.35]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>{detail.title}</Text>

        {/* Metadata chips */}
        <MetadataChips detail={detail} />

        {/* Watchlist button */}
        <View style={styles.watchlistContainer}>
          <WatchlistButton detail={detail} />
        </View>

        {/* Synopsis */}
        <Synopsis overview={detail.overview} />

        {/* Cast */}
        {cast.length > 0 && (
          <View style={styles.castSection}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <FlatList
              horizontal
              data={cast}
              keyExtractor={castKeyExtractor}
              renderItem={renderCastItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.castListContent}
              ItemSeparatorComponent={CastItemSeparator}
            />
          </View>
        )}

        {/* More Like This */}
        {similar.length > 0 && (
          <View style={styles.similarSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitleInRow}>More Like This</Text>
              <Text style={styles.seeAll}>See All</Text>
            </View>
            <FlatList
              horizontal
              data={similar}
              keyExtractor={similarKeyExtractor}
              renderItem={renderSimilarItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarListContent}
              ItemSeparatorComponent={SimilarItemSeparator}
            />
          </View>
        )}
      </ScrollView>

      {/* Floating header */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={spacing.xs}
          style={styles.headerIcon}>
          <Ionicon
            name="arrow-back"
            size={spacing.xl}
            color={colors.on_surface}
          />
        </Pressable>
        <Pressable hitSlop={spacing.xs} style={styles.headerIcon}>
          <Ionicon
            name="share-outline"
            size={spacing.xl}
            color={colors.on_surface}
          />
        </Pressable>
      </View>
    </View>
  );
}

const similarCardStyle = {width: SIMILAR_CARD_WIDTH};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingBottom: spacing['4xl'],
  },
  centered: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.body_md,
    color: colors.primary_container,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  headerIcon: {
    width: HEADER_ICON_SIZE,
    height: HEADER_ICON_SIZE,
    borderRadius: HEADER_ICON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Backdrop — HTML: h-[220px], gradient covers full inset-0
  backdropContainer: {
    width: SCREEN_WIDTH,
    height: BACKDROP_HEIGHT,
  },
  backdropImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backdropPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface_container,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Title — HTML: -mt-8, text-4xl extrabold tracking-tighter, mb-3
  title: {
    ...typography.display_md,
    color: colors.on_surface,
    paddingHorizontal: spacing.xl,
    marginTop: -spacing['2xl'],
  },

  // Chips — HTML: flex-wrap gap-3, bg-surface-container-high, px-2 py-1 rounded-md text-xs
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  chip: {
    backgroundColor: colors.surface_container_high,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.xs,
  },
  chipText: {
    ...typography.label_sm,
    fontWeight: '500',
    color: colors.on_surface_variant,
  },
  ratingChip: {
    backgroundColor: colors.rating_chip_bg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  ratingChipText: {
    fontWeight: '700',
    color: colors.primary_cta,
  },

  // Watchlist — HTML: h-12 rounded-lg, gradient to-br, mb-8
  watchlistContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  watchlistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: spacing['4xl'],
    borderRadius: spacing.xs,
  },
  watchlistBtnAdded: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  watchlistBtnPressed: {
    opacity: 0.8,
  },
  watchlistTextDefault: {
    ...typography.title_sm,
    color: colors.on_primary_cta,
  },
  watchlistTextAdded: {
    ...typography.title_sm,
    color: colors.primary,
  },

  // Section titles — HTML: text-lg font-bold Manrope
  sectionTitle: {
    ...typography.title_lg,
    fontWeight: '700',
    color: colors.on_surface,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionTitleInRow: {
    ...typography.title_lg,
    fontWeight: '700',
    color: colors.on_surface,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  seeAll: {
    ...typography.label_sm,
    fontWeight: '700',
    color: colors.primary,
  },

  // Synopsis — HTML: mb-10, text-sm leading-relaxed text-on-surface-variant
  synopsisSection: {
    marginBottom: spacing['3xl'],
  },
  synopsisBody: {
    position: 'relative',
    paddingHorizontal: spacing.xl,
  },
  synopsisText: {
    ...typography.body_md,
    color: colors.on_surface_variant,
    lineHeight: 22,
  },
  synopsisMeasure: {
    position: 'absolute',
    /** >0 so layout engines still run full text measurement (opacity:0 can skip onTextLayout on some devices) */
    opacity: 0.02,
    left: 0,
    top: 0,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  readMoreLabel: {
    ...typography.title_sm,
    fontWeight: '600',
    color: colors.primary,
  },

  // Cast — HTML: w-16 h-16 (64px), ring-2 ring-outline-variant/20, gap-6, mb-10
  castSection: {
    marginBottom: spacing['3xl'],
  },
  castListContent: {
    paddingHorizontal: spacing.xl,
  },
  castSeparator: {
    width: spacing.xl,
  },
  castItem: {
    alignItems: 'center',
    width: CAST_AVATAR_SIZE,
  },
  castAvatar: {
    width: CAST_AVATAR_SIZE,
    height: CAST_AVATAR_SIZE,
    borderRadius: CAST_AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.outline_variant,
    marginBottom: spacing.xs,
  },
  castPlaceholder: {
    backgroundColor: colors.surface_container_highest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  castName: {
    ...typography.label_sm,
    fontWeight: '600',
    color: colors.on_surface,
    textAlign: 'center',
  },
  castCharacter: {
    ...typography.label_sm,
    color: colors.on_surface_variant,
    textAlign: 'center',
  },

  // Similar — HTML: w-[120px], gap-4, mb-4 on header
  similarSection: {
    marginBottom: spacing.md,
  },
  similarListContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  similarSeparator: {
    width: spacing.md,
  },
});
