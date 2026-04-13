import {useCallback, useEffect, useMemo, useState} from 'react';
import {ApiClientError} from '../api/client';
import {getMovieGenres} from '../api/movies';
import type {Genre} from '../api/types';
import type {GenreChipOption} from '../utils/displayGenres';
import {buildGenreChipOptions, buildGenreNamesById} from '../utils/displayGenres';
import type {UseQueryResult} from './types';

export function useDisplayGenres(): UseQueryResult<GenreChipOption[]> & {
  genreNamesById: Map<number, string>;
} {
  const [rawGenres, setRawGenres] = useState<Genre[]>([]);
  const [data, setData] = useState<GenreChipOption[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const genres = await getMovieGenres();
      setRawGenres(genres);
      setData(buildGenreChipOptions(genres));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof ApiClientError
          ? err.message
          : 'Failed to load genres',
      );
    }
  }, []);

  useEffect(() => {
    fetch().catch(() => {});
  }, [fetch]);

  const genreNamesById = useMemo(
    () => buildGenreNamesById(rawGenres),
    [rawGenres],
  );

  return {data, loading, error, refetch: fetch, genreNamesById};
}
