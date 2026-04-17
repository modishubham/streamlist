import {useCallback, useEffect, useState} from 'react';
import {getSimilarMovies} from '../api/movies';
import type {Movie} from '../api/types';

export function useSimilarMovies(movieId: number | null): {
  movies: Movie[];
  loading: boolean;
} {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (movieId === null) {
      setMovies([]);
      return;
    }
    setLoading(true);
    try {
      const result = await getSimilarMovies(movieId);
      setMovies(result.results);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetch().catch(() => {});
  }, [fetch]);

  return {movies, loading};
}
