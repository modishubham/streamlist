import React, {useCallback, useMemo} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {Movie} from '../api/types';
import ContentCard from '../components/common/ContentCard';
import {useMovieList} from '../hooks/usePaginatedMovies';
import type {RootStackParamList} from '../navigation/types';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import {formatMovieSubtitle} from '../utils/movieDisplay';
import {useDisplayGenres} from '../hooks/useDisplayGenres';
import MovieListSkeleton from '../components/skeleton/MovieListSkeleton';
import SkeletonFooterStrip from '../components/skeleton/SkeletonFooterStrip';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieList'>;

const NUM_COLUMNS = 2;
const CARD_GAP = spacing.md;

export default function MovieListScreen({route, navigation}: Props) {
  const {mode, genreId} = route.params;
  const {width: windowWidth} = useWindowDimensions();
  const {genreNamesById} = useDisplayGenres();
  const {
    movies,
    loading,
    loadingMore,
    error,
    appendNextPage,
    page,
    totalPages,
  } = useMovieList(mode, genreId);

  const cardWidth = useMemo(
    () =>
      (windowWidth - spacing.md * 2 - CARD_GAP * (NUM_COLUMNS - 1)) /
      NUM_COLUMNS,
    [windowWidth],
  );

  const onEndReached = useCallback(() => {
    if (page < totalPages && !loadingMore) {
      appendNextPage().catch(() => {});
    }
  }, [appendNextPage, loadingMore, page, totalPages]);

  const openDetail = useCallback(
    (movieId: number) => {
      navigation.navigate('Detail', {movieId});
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({item}: {item: Movie}) => (
      <View style={styles.cardCell}>
        <ContentCard
          posterPath={item.poster_path}
          title={item.title}
          subtitle={formatMovieSubtitle(item, genreNamesById)}
          rating={item.vote_average}
          onPress={() => openDetail(item.id)}
          style={{width: cardWidth}}
        />
      </View>
    ),
    [cardWidth, genreNamesById, openDetail],
  );

  const keyExtractor = useCallback((item: Movie) => String(item.id), []);

  if (loading && movies.length === 0) {
    return (
      <SafeAreaView style={styles.skeletonScreen} edges={['bottom']}>
        <MovieListSkeleton />
      </SafeAreaView>
    );
  }

  if (error && movies.length === 0) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={movies}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.list}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.35}
        ListFooterComponent={loadingMore ? <SkeletonFooterStrip /> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  skeletonScreen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing['3xl'],
  },
  gridRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  cardCell: {
    flex: 1,
  },
  errorText: {
    ...typography.body_md,
    color: colors.primary_container,
    textAlign: 'center',
  },
});
