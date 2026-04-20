import React, {useCallback} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
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

function MovieListSeparator() {
  return <View style={movieListStyles.itemSeparator} />;
}

export default function MovieListScreen({route, navigation}: Props) {
  const {mode, genreId} = route.params;
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
      <ContentCard
        posterPath={item.poster_path}
        title={item.title}
        subtitle={formatMovieSubtitle(item, genreNamesById)}
        onPress={() => openDetail(item.id)}
        style={styles.card}
      />
    ),
    [genreNamesById, openDetail],
  );

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
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={MovieListSeparator}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.35}
        ListFooterComponent={loadingMore ? <SkeletonFooterStrip /> : null}
      />
    </SafeAreaView>
  );
}

const movieListStyles = StyleSheet.create({
  itemSeparator: {
    height: spacing.md,
  },
});

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
  card: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  errorText: {
    ...typography.body_md,
    color: colors.primary_container,
    textAlign: 'center',
  },
});
