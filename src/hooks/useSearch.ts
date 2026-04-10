import {useCallback, useEffect, useRef, useState} from 'react';
import {searchMovies} from '../api/movies';
import type {Movie} from '../api/types';

interface SearchState {
  results: Movie[];
  loading: boolean;
  error: string | null;
}

const DEBOUNCE_MS = 400;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setState({results: [], loading: false, error: null});
      return;
    }
    setState(prev => ({...prev, loading: true, error: null}));
    try {
      const res = await searchMovies(q);
      setState({results: res.results, loading: false, error: null});
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Search failed',
      }));
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => search(query), DEBOUNCE_MS);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query, search]);

  return {...state, query, setQuery};
}
