import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/types';
import {useMovieDetail} from '../hooks/useMovieDetail';
import {useWatchlistStore} from '../store/watchlistStore';
import ContentCard from '../components/common/ContentCard';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import {getImageUrl} from '../utils/image';
import type {CastMember, Movie, MovieDetail} from '../api/types';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const BACKDROP_HEIGHT = 220;
const CAST_AVATAR_SIZE = 60;
const SIMILAR_CARD_WIDTH =
  (SCREEN_WIDTH - spacing.md * 2 - spacing.sm * 2) / 2.5;

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

function MetadataChips({detail}: {detail: MovieDetail}) {
  const chips: string[] = [];

  const year = detail.release_date?.slice(0, 4);
  if (year) {
    chips.push(year);
  }

  if (detail.vote_average && detail.vote_average > 0) {
    chips.push(`\u2605 ${detail.vote_average.toFixed(1)} Rating`);
  }

  const genre = detail.genres?.[0]?.name;
  if (genre) {
    chips.push(genre);
  }

  if (detail.runtime && detail.runtime > 0) {
    chips.push(formatRuntime(detail.runtime));
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <View style={styles.chipsRow}>
      {chips.map(label => (
        <View key={label} style={styles.chip}>
          <Text style={styles.chipText}>{label}</Text>
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
        <MaterialIcon
          name="bookmark"
          size={20}
          color={colors.primary_container}
        />
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
        end={{x: 1, y: 0}}
        style={styles.watchlistBtn}>
        <MaterialIcon
          name="bookmark-plus-outline"
          size={20}
          color={colors.on_primary_cta}
        />
        <Text style={styles.watchlistTextDefault}>Add to Watchlist</Text>
      </LinearGradient>
    </Pressable>
  );
}

function Synopsis({overview}: {overview: string}) {
  const [expanded, setExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);

  const handleTextLayout = useCallback(
    (e: {nativeEvent: {lines: Array<{text: string}>}}) => {
      if (e.nativeEvent.lines.length > 3 && !expanded) {
        setNeedsTruncation(true);
      }
    },
    [expanded],
  );

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  }, []);

  if (!overview) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Synopsis</Text>
      <Text
        style={styles.synopsisText}
        numberOfLines={expanded ? undefined : 3}
        onTextLayout={handleTextLayout}>
        {overview}
      </Text>
      {needsTruncation && (
        <Pressable onPress={toggle} hitSlop={spacing.xs}>
          <Text style={styles.readMore}>
            {expanded ? 'Show Less' : 'Read More'}
          </Text>
        </Pressable>
      )}
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
    () => (data?.detail ? getImageUrl(data.detail.backdrop_path, 'w780') : null),
    [data?.detail],
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
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
              <MaterialIcon
                name="movie-open"
                size={48}
                color={colors.on_surface_variant}
              />
            </View>
          )}
          <LinearGradient
            colors={['transparent', colors.surface]}
            locations={[0.0, 1.0]}
            style={styles.backdropGradient}
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
          <View style={styles.section}>
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
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>More Like This</Text>
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
            name="chevron-back"
            size={24}
            color={colors.on_surface}
          />
        </Pressable>
        <Pressable hitSlop={spacing.xs} style={styles.headerIcon}>
          <Ionicon
            name="share-outline"
            size={22}
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
    paddingBottom: spacing['3xl'],
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

  // Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    zIndex: 10,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Backdrop
  backdropContainer: {
    width: SCREEN_WIDTH,
    height: BACKDROP_HEIGHT,
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  backdropPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface_container,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BACKDROP_HEIGHT * 0.4,
  },

  // Title
  title: {
    ...typography.display_md,
    color: colors.on_surface,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },

  // Chips
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surface_container_highest,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.sm,
  },
  chipText: {
    ...typography.label_sm,
    color: colors.on_surface_variant,
  },

  // Watchlist
  watchlistContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  watchlistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
  },
  watchlistBtnAdded: {
    backgroundColor: colors.surface_container_highest,
    borderWidth: 1,
    borderColor: colors.outline_variant,
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
    color: colors.on_surface,
  },

  // Sections
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.headline_md,
    color: colors.on_surface,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  seeAll: {
    ...typography.title_sm,
    color: colors.see_all,
  },

  // Synopsis
  synopsisText: {
    ...typography.body_md,
    color: colors.on_surface,
    paddingHorizontal: spacing.md,
    lineHeight: 22,
  },
  readMore: {
    ...typography.title_sm,
    color: colors.primary_container,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xxs,
  },

  // Cast
  castListContent: {
    paddingHorizontal: spacing.md,
  },
  castSeparator: {
    width: spacing.md,
  },
  castItem: {
    alignItems: 'center',
    width: CAST_AVATAR_SIZE + spacing.lg,
  },
  castAvatar: {
    width: CAST_AVATAR_SIZE,
    height: CAST_AVATAR_SIZE,
    borderRadius: CAST_AVATAR_SIZE / 2,
  },
  castPlaceholder: {
    backgroundColor: colors.surface_container_highest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  castName: {
    ...typography.label_sm,
    color: colors.on_surface,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  castCharacter: {
    ...typography.label_sm,
    color: colors.on_surface_variant,
    marginTop: spacing.xxs,
    textAlign: 'center',
  },

  // Similar
  similarListContent: {
    paddingHorizontal: spacing.md,
  },
  similarSeparator: {
    width: spacing.sm,
  },
});
