import {useCallback, useEffect, useState} from 'react';
import {getMovieDetail} from '../api/movies';
import type {MovieDetail} from '../api/types';

interface DetailState {
  movie: MovieDetail | null;
  loading: boolean;
  error: string | null;
}

export function useMovieDetail(movieId: number) {
  const [state, setState] = useState<DetailState>({
    movie: null,
    loading: true,
    error: null,
  });

  const fetchDetail = useCallback(async () => {
    setState(prev => ({...prev, loading: true, error: null}));
    try {
      const data = await getMovieDetail(movieId);
      setState({movie: data, loading: false, error: null});
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load details',
      }));
    }
  }, [movieId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {...state, refetch: fetchDetail};
}
