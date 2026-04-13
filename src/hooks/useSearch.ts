import {useCallback, useEffect, useRef, useState} from 'react';
import {ApiClientError} from '../api/client';
import {searchMovies} from '../api/movies';
import type {Movie} from '../api/types';
import type {UseQueryResult} from './types';

const DEBOUNCE_MS = 400;

export function useSearch(): UseQueryResult<Movie[]> & {
  query: string;
  setQuery: (q: string) => void;
} {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await searchMovies(q);
      setData(res.results);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof ApiClientError ? err.message : 'Search failed',
      );
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      search(query).catch(() => {});
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query, search]);

  const refetch = useCallback(() => {
    search(query).catch(() => {});
  }, [query, search]);

  return {data, loading, error, refetch, query, setQuery};
}
