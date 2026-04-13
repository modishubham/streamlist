import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import GenreChipStrip from '../components/home/GenreChipStrip';
import HeroFeaturedCard from '../components/home/HeroFeaturedCard';
import {HOME_HEADER_CONTENT_HEIGHT} from '../components/home/homeLayout';
import HomeHeader from '../components/home/HomeHeader';
import HomeLoadingFooter from '../components/home/HomeLoadingFooter';
import MovieRow from '../components/home/MovieRow';
import {useDisplayGenres} from '../hooks/useDisplayGenres';
import {
  useDiscoverMovies,
  usePaginatedTopRated,
  usePaginatedTrending,
} from '../hooks/usePaginatedMovies';
import type {RootStackParamList} from '../navigation/types';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import type {GenreChipOption} from '../utils/displayGenres';
import {buildGenreChipOptions} from '../utils/displayGenres';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const HERO_WIDTH = SCREEN_WIDTH - spacing.md * 2;
const SCROLL_LOAD_MORE_THRESHOLD = 400;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
  const stackNav =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const scrollY = useRef(new Animated.Value(0)).current;

  const {data: genreOptions, genreNamesById} = useDisplayGenres();
  const chipOptions = genreOptions ?? buildGenreChipOptions([]);

  const [selectedGenre, setSelectedGenre] = useState<GenreChipOption>({
    id: null,
    label: 'All',
  });

  const trending = usePaginatedTrending();
  const topRated = usePaginatedTopRated();
  const discover = useDiscoverMovies(selectedGenre.id);

  const openDetail = useCallback(
    (movieId: number) => {
      stackNav?.navigate('Detail', {movieId});
    },
    [stackNav],
  );

  const openMovieList = useCallback(
    (params: {
      mode: 'trending' | 'top_rated' | 'discover';
      title: string;
      genreId?: number;
    }) => {
      stackNav?.navigate('MovieList', params);
    },
    [stackNav],
  );

  const headerSurfaceOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: false,
      listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const {contentOffset, layoutMeasurement, contentSize} = e.nativeEvent;
        const distanceFromEnd =
          contentSize.height - layoutMeasurement.height - contentOffset.y;
        if (distanceFromEnd < SCROLL_LOAD_MORE_THRESHOLD) {
          trending.appendNextPage().catch(() => {});
          topRated.appendNextPage().catch(() => {});
          discover.appendNextPage().catch(() => {});
        }
      },
    },
  );

  const heroMovie = trending.movies[0];

  const hasMorePages =
    trending.page < trending.totalPages ||
    topRated.page < topRated.totalPages ||
    discover.page < discover.totalPages;

  const hasAnyRowContent =
    trending.movies.length > 0 ||
    topRated.movies.length > 0 ||
    discover.movies.length > 0;

  const footerLoading =
    trending.loadingMore || topRated.loadingMore || discover.loadingMore;
  /** Only show while a load is in flight; hide idle row when no more pages or nothing to load. */
  const showFooter = hasMorePages && hasAnyRowContent && footerLoading;

  const initialBlocking =
    trending.loading && trending.movies.length === 0;

  if (initialBlocking) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary_container} />
      </SafeAreaView>
    );
  }

  if (trending.error && trending.movies.length === 0) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <Text style={styles.errorText}>{trending.error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop:
            insets.top + HOME_HEADER_CONTENT_HEIGHT + spacing.md,
          paddingBottom: tabBarHeight + spacing.lg,
        }}
        showsVerticalScrollIndicator={false}>
        <GenreChipStrip
          options={chipOptions}
          selectedId={selectedGenre.id}
          onSelect={setSelectedGenre}
        />
        {heroMovie ? (
          <HeroFeaturedCard
            movie={heroMovie}
            cardWidth={HERO_WIDTH}
            onWatchNow={() => openDetail(heroMovie.id)}
            onDetails={() => openDetail(heroMovie.id)}
          />
        ) : null}
        <View style={styles.rows}>
          <MovieRow
            title="Trending Now"
            movies={trending.movies}
            genreNamesById={genreNamesById}
            onSeeAll={() =>
              openMovieList({mode: 'trending', title: 'Trending Now'})
            }
            onSelectMovie={openDetail}
            onNearEnd={() => {
              trending.appendNextPage().catch(() => {});
            }}
            listKey="trending"
          />
          <MovieRow
            title="Top Rated"
            movies={topRated.movies}
            genreNamesById={genreNamesById}
            onSeeAll={() =>
              openMovieList({mode: 'top_rated', title: 'Top Rated'})
            }
            onSelectMovie={openDetail}
            onNearEnd={() => {
              topRated.appendNextPage().catch(() => {});
            }}
            listKey="top_rated"
          />
          {discover.loading && discover.movies.length === 0 ? (
            <View style={styles.rowLoading}>
              <ActivityIndicator color={colors.primary_container} />
            </View>
          ) : discover.error && discover.movies.length === 0 ? (
            <View style={styles.rowMessage}>
              <Text style={styles.rowErrorText}>{discover.error}</Text>
            </View>
          ) : (
            <MovieRow
              title={selectedGenre.label}
              movies={discover.movies}
              genreNamesById={genreNamesById}
              onSeeAll={() =>
                openMovieList({
                  mode: 'discover',
                  title: selectedGenre.label,
                  ...(selectedGenre.id !== null
                    ? {genreId: selectedGenre.id}
                    : {}),
                })
              }
              onSelectMovie={openDetail}
              onNearEnd={() => {
                discover.appendNextPage().catch(() => {});
              }}
              listKey={`discover-${selectedGenre.id ?? 'all'}`}
            />
          )}
        </View>
        <HomeLoadingFooter visible={showFooter} loading={footerLoading} />
      </Animated.ScrollView>

      <Animated.View
        style={[
          styles.headerShell,
          {paddingTop: insets.top},
        ]}>
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: colors.header_surface,
              opacity: headerSurfaceOpacity,
            },
          ]}
        />
        <HomeHeader />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerShell: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  rows: {
    marginTop: spacing.md,
  },
  rowLoading: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  rowMessage: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  rowErrorText: {
    ...typography.body_md,
    color: colors.primary_container,
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
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
