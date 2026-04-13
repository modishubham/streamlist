import {useCallback, useEffect, useState} from 'react';
import {ApiClientError} from '../api/client';
import {getMovieDetail} from '../api/movies';
import type {MovieDetail} from '../api/types';
import type {UseQueryResult} from './types';

export function useMovieDetail(movieId: number): UseQueryResult<MovieDetail> {
  const [data, setData] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const movie = await getMovieDetail(movieId);
      setData(movie);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof ApiClientError
          ? err.message
          : 'Failed to load details',
      );
    }
  }, [movieId]);

  useEffect(() => {
    fetchDetail().catch(() => {});
  }, [fetchDetail]);

  return {data, loading, error, refetch: fetchDetail};
}
