import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ContentCard from '../components/common/ContentCard';
import GenreChipStrip from '../components/home/GenreChipStrip';
import {useRecentSearches} from '../hooks/useRecentSearches';
import {useSearch} from '../hooks/useSearch';
import {usePaginatedTrending} from '../hooks/usePaginatedMovies';
import type {RootStackParamList} from '../navigation/types';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import type {GenreChipOption} from '../utils/displayGenres';
import {chunkPairs} from '../utils/chunkPairs';
import type {Movie} from '../api/types';

const CARD_GAP = spacing.md;
const NUM_COLUMNS = 2;
const SEARCH_BAR_MIN_HEIGHT = spacing['2xl'] + spacing.lg;

const SEARCH_CHIPS: GenreChipOption[] = [
  {id: 28, label: 'Action'},
  {id: 35, label: 'Comedy'},
  {id: 878, label: 'Sci-Fi'},
  {id: 27, label: 'Horror'},
  {id: 18, label: 'Drama'},
  {id: 99, label: 'Documentary'},
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const {width: windowWidth} = useWindowDimensions();
  const navigation = useNavigation();
  const stackNav =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const {data, loading, error, query, setQuery} = useSearch();
  const {searches, addSearch, clearAll} = useRecentSearches();
  const trending = usePaginatedTrending();

  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedChipLabel, setSelectedChipLabel] = useState<string | null>(
    null,
  );

  const cardWidth =
    (windowWidth - spacing.md * 2 - CARD_GAP * (NUM_COLUMNS - 1)) /
    NUM_COLUMNS;

  useEffect(() => {
    if (data && data.length > 0 && query.trim()) {
      addSearch(query.trim());
    }
  }, [data, query, addSearch]);

  const handleChipSelect = useCallback(
    (chip: GenreChipOption) => {
      setSelectedChipLabel(chip.label);
      setQuery(chip.label);
      inputRef.current?.blur();
    },
    [setQuery],
  );

  const handleRecentSelect = useCallback(
    (term: string) => {
      setQuery(term);
      setSelectedChipLabel(null);
      inputRef.current?.blur();
    },
    [setQuery],
  );

  const openDetail = useCallback(
    (movieId: number) => {
      stackNav?.navigate('Detail', {movieId});
    },
    [stackNav],
  );

  const renderSearchItem = useCallback(
    ({item}: {item: Movie}) => (
      <View style={styles.cardCell}>
        <ContentCard
          posterPath={item.poster_path}
          title={item.title}
          subtitle={item.release_date?.slice(0, 4)}
          rating={item.vote_average}
          onPress={() => openDetail(item.id)}
        />
      </View>
    ),
    [openDetail],
  );

  const keyExtractor = useCallback(
    (item: Movie) => String(item.id),
    [],
  );

  const movies = data ?? [];
  const showResults = query.trim().length > 0;
  const showEmpty = showResults && !loading && !error && movies.length === 0;
  const trendingRows = chunkPairs(trending.movies);

  return (
    <View style={styles.root}>
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
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={16} color={colors.on_surface} />
          </View>
        </View>

        <View
          style={[
            styles.searchBar,
            isFocused && styles.searchBarFocused,
          ]}>
          <Icon name="search" size={20} color={colors.on_surface_placeholder} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search movies, actors, directors..."
            placeholderTextColor={colors.on_surface_placeholder}
            value={query}
            onChangeText={text => {
              setQuery(text);
              if (selectedChipLabel && text !== selectedChipLabel) {
                setSelectedChipLabel(null);
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => {
                setQuery('');
                setSelectedChipLabel(null);
              }}
              hitSlop={spacing.xs}>
              <Icon
                name="close"
                size={18}
                color={colors.on_surface_variant}
              />
            </Pressable>
          )}
        </View>

        {!showResults && (
          <GenreChipStrip
            options={SEARCH_CHIPS}
            selectedId={
              SEARCH_CHIPS.find(c => c.label === selectedChipLabel)?.id ?? -1
            }
            onSelect={handleChipSelect}
          />
        )}
      </View>

      <View style={styles.content}>
        {showResults ? (
          <>
            {loading && movies.length === 0 && (
              <View style={styles.centered}>
                <ActivityIndicator
                  size="large"
                  color={colors.primary_container}
                />
              </View>
            )}

            {error && (
              <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {showEmpty && (
              <View style={styles.centered}>
                <Icon
                  name="search-off"
                  size={48}
                  color={colors.surface_container_high}
                />
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            )}

            {movies.length > 0 && (
              <FlatList
                data={movies}
                renderItem={renderSearchItem}
                keyExtractor={keyExtractor}
                numColumns={NUM_COLUMNS}
                columnWrapperStyle={styles.resultsGridRow}
                ListHeaderComponent={
                  <Text style={styles.resultCount}>
                    {movies.length} results for &apos;{query.trim()}&apos;
                  </Text>
                }
                contentContainerStyle={{
                  paddingHorizontal: spacing.md,
                  paddingTop: spacing.md,
                  paddingBottom: tabBarHeight + spacing.lg,
                }}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
              />
            )}
          </>
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: tabBarHeight + spacing.lg,
            }}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag">
            {searches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                  <Pressable onPress={clearAll} hitSlop={spacing.xs}>
                    <Text style={styles.clearAll}>CLEAR ALL</Text>
                  </Pressable>
                </View>
                {searches.map(term => (
                  <Pressable
                    key={term}
                    style={styles.recentRow}
                    onPress={() => handleRecentSelect(term)}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={colors.on_surface_variant}
                    />
                    <Text style={styles.recentText}>{term}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Trending Now</Text>
              </View>
              {trending.loading && trending.movies.length === 0 ? (
                <View style={styles.trendingLoading}>
                  <ActivityIndicator
                    size="large"
                    color={colors.primary_container}
                  />
                </View>
              ) : (
                <View style={styles.trendingGrid}>
                  {trendingRows.map((row, rowIdx) => (
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
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
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
  profileIcon: {
    width: spacing['2xl'],
    height: spacing['2xl'],
    borderRadius: spacing.md,
    backgroundColor: colors.surface_container_high,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: SEARCH_BAR_MIN_HEIGHT,
    backgroundColor: colors.surface_container_low,
    borderRadius: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchBarFocused: {
    borderColor: colors.outline_variant,
  },
  searchInput: {
    ...typography.search_input,
    color: colors.on_surface,
    flex: 1,
    paddingVertical: 0,
  },
  content: {
    flex: 1,
  },
  resultCount: {
    ...typography.label_sm,
    color: colors.on_surface_variant,
    marginBottom: spacing.md,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.headline_md,
    color: colors.on_surface,
  },
  clearAll: {
    ...typography.title_sm,
    color: colors.primary_cta,
    textTransform: 'uppercase',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  recentText: {
    ...typography.body_md,
    color: colors.on_surface,
  },
  trendingLoading: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  trendingGrid: {
    paddingHorizontal: spacing.md,
    gap: CARD_GAP,
  },
  gridRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
  },
  resultsGridRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  cardCell: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  errorText: {
    ...typography.body_md,
    color: colors.primary_container,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body_md,
    color: colors.on_surface_variant,
    textAlign: 'center',
  },
});
