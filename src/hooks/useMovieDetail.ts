import {useCallback, useEffect, useState} from 'react';
import {ApiClientError} from '../api/client';
import {getMovieCredits, getMovieDetail, getSimilarMovies} from '../api/movies';
import type {CastMember, Movie, MovieDetail} from '../api/types';
import type {UseQueryResult} from './types';

export interface DetailData {
  detail: MovieDetail;
  cast: CastMember[];
  similar: Movie[];
}

export function useMovieDetail(movieId: number): UseQueryResult<DetailData> {
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [detailResult, creditsResult, similarResult] =
      await Promise.allSettled([
        getMovieDetail(movieId),
        getMovieCredits(movieId),
        getSimilarMovies(movieId),
      ]);

    if (detailResult.status === 'rejected') {
      const err = detailResult.reason;
      setError(
        err instanceof ApiClientError
          ? err.message
          : 'Failed to load details',
      );
      setLoading(false);
      return;
    }

    setData({
      detail: detailResult.value,
      cast:
        creditsResult.status === 'fulfilled'
          ? creditsResult.value.cast
          : [],
      similar:
        similarResult.status === 'fulfilled'
          ? similarResult.value.results
          : [],
    });
    setLoading(false);
  }, [movieId]);

  useEffect(() => {
    fetchAll().catch(() => {});
  }, [fetchAll]);

  return {data, loading, error, refetch: fetchAll};
}
