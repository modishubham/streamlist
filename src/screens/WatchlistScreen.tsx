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
import AppBrandedHeader from '../components/common/AppBrandedHeader';
import ContentCard from '../components/common/ContentCard';
import WatchlistCard from '../components/watchlist/WatchlistCard';
import WatchlistSimilarRow from '../components/watchlist/WatchlistSimilarRow';
import {useDisplayGenres} from '../hooks/useDisplayGenres';
import {usePaginatedTrending} from '../hooks/usePaginatedMovies';
import {useWatchlistStore} from '../store/watchlistStore';
import type {RootStackParamList, RootTabParamList} from '../navigation/types';
import {colors} from '../theme/colors';
import {radius, spacing, stitchLayout} from '../theme/spacing';
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
        <AppBrandedHeader
          rightSlot={
            <View style={styles.headerActions}>
              <Pressable
                onPress={navigateToSearch}
                style={styles.iconBtn}
                hitSlop={spacing.xs}
                accessibilityRole="button"
                accessibilityLabel="Search">
                <Icon
                  name="search"
                  size={24}
                  color={colors.on_surface_variant}
                />
              </Pressable>
              <View
                style={styles.profileAvatar}
                accessibilityLabel="Profile">
                <Icon
                  name="person"
                  size={22}
                  color={colors.on_surface_variant}
                />
              </View>
            </View>
          }
        />
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
            {/* ─── Filter tabs (full-width track + 12px pill segments) ─ */}
            <View style={styles.filterBar}>
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
                      {tab === 'all'
                        ? 'All'
                        : tab === 'movies'
                          ? 'Movies'
                          : 'Series'}
                    </Text>
                  </Pressable>
                ))}
              </View>
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
                <View style={styles.ctaButton}>
                  <Text style={styles.ctaText}>Browse Trending Now</Text>
                </View>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface_container_highest,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
    paddingHorizontal: stitchLayout.screenGutter,
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

  // Filter tabs — full-width track; active segment uses deep red (see mock)
  filterBar: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: colors.surface_container,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: stitchLayout.screenGutter,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: 'transparent',
  },
  filterTabActive: {
    backgroundColor: colors.secondary_container,
  },
  filterTabText: {
    ...typography.title_sm,
    color: colors.on_surface_variant,
  },
  filterTabTextActive: {
    ...typography.title_sm,
    fontFamily: 'Manrope-Bold',
    fontWeight: '700',
    color: colors.on_surface,
  },

  // Filter empty
  filterEmpty: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    paddingHorizontal: stitchLayout.screenGutter,
    gap: spacing.md,
  },
  filterEmptyTitle: {
    ...typography.body_md,
    color: colors.on_surface_variant,
    textAlign: 'center',
  },
  browseAllChip: {
    paddingHorizontal: stitchLayout.screenGutter,
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
    paddingHorizontal: stitchLayout.screenGutter,
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
    paddingHorizontal: stitchLayout.screenGutter,
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
  ctaButton: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary_cta,
  },
  ctaText: {
    ...typography.chip_label,
    fontFamily: 'Manrope-Bold',
    fontWeight: '700',
    color: colors.on_surface,
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
    paddingHorizontal: stitchLayout.screenGutter,
    marginBottom: spacing.md,
  },
  popularGrid: {
    paddingHorizontal: stitchLayout.screenGutter,
    gap: CARD_GAP,
  },
});
