import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import ContentCard from '../components/common/ContentCard';
import WatchlistCard from '../components/watchlist/WatchlistCard';
import WatchlistSimilarRow from '../components/watchlist/WatchlistSimilarRow';
import {useDisplayGenres} from '../hooks/useDisplayGenres';
import {usePaginatedTrending} from '../hooks/usePaginatedMovies';
import {useWatchlistStore} from '../store/watchlistStore';
import type {RootStackParamList, RootTabParamList} from '../navigation/types';
import {colors} from '../theme/colors';
import {spacing, radius} from '../theme/spacing';
import {typography} from '../theme/typography';
import {chunkPairs} from '../utils/chunkPairs';
type FilterTab = 'all' | 'movies' | 'series';

const CARD_GAP = spacing.md;
const NUM_COLUMNS = 2;
const POPULAR_PREVIEW_COUNT = 6;

export default function WatchlistScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const {width: windowWidth} = useWindowDimensions();

  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const stackNav =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const items = useWatchlistStore(state => state.items);
  const removeFromWatchlist = useWatchlistStore(
    state => state.removeFromWatchlist,
  );

  const {genreNamesById} = useDisplayGenres();
  const [filter, setFilter] = useState<FilterTab>('all');

  const trending = usePaginatedTrending();
  const popularPreview = useMemo(
    () => trending.movies.slice(0, POPULAR_PREVIEW_COUNT),
    [trending.movies],
  );

  const filteredItems = useMemo(() => {
    if (filter === 'movies') {
      return items.filter(
        i => !i.media_type || i.media_type === 'movie',
      );
    }
    if (filter === 'series') {
      return items.filter(i => i.media_type === 'tv');
    }
    return items;
  }, [items, filter]);

  const cardWidth =
    (windowWidth - spacing.md * 2 - CARD_GAP * (NUM_COLUMNS - 1)) /
    NUM_COLUMNS;

  const gridRows = useMemo(() => chunkPairs(filteredItems), [filteredItems]);

  const openDetail = useCallback(
    (movieId: number) => {
      stackNav?.navigate('Detail', {movieId});
    },
    [stackNav],
  );

  const navigateToSearch = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const navigateToHome = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const hasItems = items.length > 0;
  const filterLabel = filter === 'series' ? 'Series' : 'Movies';
  const showFilterEmpty =
    filter !== 'all' && filteredItems.length === 0 && hasItems;

  return (
    <View style={styles.root}>
      {/* ─── Header ──────────────────────────────────────────────────── */}
      <View style={[styles.headerShell, {paddingTop: insets.top}]}>
        <View style={styles.headerRow}>
          <View style={styles.brand}>
            <Icon
              name="local-fire-department"
              size={28}
              color={colors.primary_container}
            />
            <Text style={styles.wordmark}>StreamList</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={navigateToSearch}
              style={styles.iconBtn}
              hitSlop={spacing.xs}
              accessibilityRole="button"
              accessibilityLabel="Search">
              <Icon name="search" size={20} color={colors.on_surface} />
            </Pressable>
            <View style={styles.profileIcon}>
              <Ionicons name="person" size={16} color={colors.on_surface} />
            </View>
          </View>
        </View>
      </View>

      {/* ─── Content ─────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: tabBarHeight + spacing.lg},
        ]}
        showsVerticalScrollIndicator={false}>

        {/* Collection heading */}
        <View style={styles.headingBlock}>
          <Text style={styles.collectionLabel}>YOUR COLLECTION</Text>
          <Text style={styles.pageTitle}>My Watchlist</Text>
          <Text style={styles.titleCount}>
            {items.length} {items.length === 1 ? 'title' : 'titles'}
          </Text>
        </View>

        {hasItems ? (
          <>
            {/* ─── Filter tabs ─────────────────────────────────────── */}
            <View style={styles.filterRow}>
              {(['all', 'movies', 'series'] as FilterTab[]).map(tab => (
                <Pressable
                  key={tab}
                  onPress={() => setFilter(tab)}
                  style={[
                    styles.filterTab,
                    filter === tab && styles.filterTabActive,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{selected: filter === tab}}>
                  <Text
                    style={[
                      styles.filterTabText,
                      filter === tab && styles.filterTabTextActive,
                    ]}>
                    {tab === 'all' ? 'All' : tab === 'movies' ? 'Movies' : 'Series'}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* ─── Contextual empty (filtered) ─────────────────────── */}
            {showFilterEmpty ? (
              <View style={styles.filterEmpty}>
                <Text style={styles.filterEmptyTitle}>
                  No {filterLabel} in your watchlist yet
                </Text>
                <Pressable
                  onPress={() => setFilter('all')}
                  style={styles.browseAllChip}
                  accessibilityRole="button">
                  <Text style={styles.browseAllChipText}>Browse All</Text>
                </Pressable>
              </View>
            ) : (
              /* ─── 2-col WatchlistCard grid ───────────────────────── */
              <View style={styles.grid}>
                {gridRows.map((row, rowIdx) => (
                  <View key={rowIdx} style={styles.gridRow}>
                    {row.map(movie => (
                      <WatchlistCard
                        key={movie.id}
                        movie={movie}
                        genreNames={movie.genre_ids
                          .map(id => genreNamesById.get(id) ?? '')
                          .filter(Boolean)}
                        onRemove={() => removeFromWatchlist(movie.id)}
                        onDetails={() => openDetail(movie.id)}
                        style={{width: cardWidth}}
                      />
                    ))}
                    {row.length < NUM_COLUMNS && (
                      <View style={{width: cardWidth}} />
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Similar movies — separate component avoids FlatList inside ScrollView (hook order bugs). */}
            <WatchlistSimilarRow
              seedMovie={items[items.length - 1]}
              genreNamesById={genreNamesById}
              onOpenDetail={openDetail}
            />
          </>
        ) : (
          <>
            {/* ─── Empty state ─────────────────────────────────────── */}
            <View style={styles.emptyBlock}>
              <Ionicons
                name="bookmark"
                size={80}
                color={colors.secondary_container}
              />
              <Text style={styles.emptyHeading}>Your watchlist is empty</Text>
              <Text style={styles.emptySubheading}>
                Save movies and shows you want to watch later{'\n'}and they'll appear here
              </Text>
              <Pressable
                onPress={navigateToHome}
                accessibilityRole="button"
                style={styles.ctaWrapper}>
                <LinearGradient
                  colors={[colors.primary_container, colors.secondary_container]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.ctaGradient}>
                  <Text style={styles.ctaText}>Browse Trending Now</Text>
                </LinearGradient>
              </Pressable>
            </View>

            {/* ─── Popular recommendations ─────────────────────────── */}
            {popularPreview.length > 0 && (
              <View style={styles.popularSection}>
                <Text style={styles.popularLabel}>POPULAR RECOMMENDATIONS</Text>
                <View style={styles.popularGrid}>
                  {chunkPairs(popularPreview).map((row, rowIdx) => (
                    <View key={rowIdx} style={styles.gridRow}>
                      {row.map(movie => (
                        <ContentCard
                          key={movie.id}
                          posterPath={movie.poster_path}
                          title={movie.title}
                          subtitle={movie.release_date?.slice(0, 4)}
                          rating={movie.vote_average}
                          onPress={() => openDetail(movie.id)}
                          style={{width: cardWidth}}
                        />
                      ))}
                      {row.length < NUM_COLUMNS && (
                        <View style={{width: cardWidth}} />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // Header
  headerShell: {
    backgroundColor: colors.header_surface,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  wordmark: {
    ...typography.title_lg,
    color: colors.primary_container,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    width: spacing['2xl'],
    height: spacing['2xl'],
    borderRadius: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: spacing['2xl'],
    height: spacing['2xl'],
    borderRadius: spacing.md,
    backgroundColor: colors.surface_container_high,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
  },

  // Heading block
  headingBlock: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  collectionLabel: {
    ...typography.label_sm,
    color: colors.on_surface_variant,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.xxs,
  },
  pageTitle: {
    ...typography.display_md,
    color: colors.on_surface,
    marginBottom: spacing.xxs,
  },
  titleCount: {
    ...typography.label_sm,
    color: colors.on_surface_variant,
  },

  // Filter tabs
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing['2xl'],
    backgroundColor: colors.surface_container,
  },
  filterTabActive: {
    backgroundColor: colors.secondary_container,
  },
  filterTabText: {
    ...typography.title_sm,
    color: colors.on_surface_variant,
  },
  filterTabTextActive: {
    color: colors.on_surface,
  },

  // Filter empty
  filterEmpty: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  filterEmptyTitle: {
    ...typography.body_md,
    color: colors.on_surface_variant,
    textAlign: 'center',
  },
  browseAllChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing['2xl'],
    backgroundColor: colors.secondary_container,
  },
  browseAllChipText: {
    ...typography.title_sm,
    color: colors.on_surface,
  },

  // Grid
  grid: {
    paddingHorizontal: spacing.md,
    gap: CARD_GAP,
    marginBottom: spacing.xl,
  },
  gridRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
  },

  // Empty state
  emptyBlock: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing['2xl'],
    gap: spacing.md,
  },
  emptyHeading: {
    ...typography.headline_md,
    color: colors.on_surface,
    textAlign: 'center',
  },
  emptySubheading: {
    ...typography.body_md,
    color: colors.on_surface_variant,
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaWrapper: {
    width: '100%',
    marginTop: spacing.xs,
  },
  ctaGradient: {
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    ...typography.title_sm,
    color: colors.on_primary_cta,
  },

  // Popular recommendations
  popularSection: {
    paddingTop: spacing.xl,
  },
  popularLabel: {
    ...typography.label_sm,
    color: colors.on_surface_variant,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  popularGrid: {
    paddingHorizontal: spacing.md,
    gap: CARD_GAP,
  },
});
