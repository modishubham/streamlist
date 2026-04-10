import {useCallback, useEffect, useState} from 'react';
import {getTrending, getTopRated} from '../api/movies';
import type {Movie} from '../api/types';

interface HomeState {
  trending: Movie[];
  topRated: Movie[];
  loading: boolean;
  error: string | null;
}

export function useHome() {
  const [state, setState] = useState<HomeState>({
    trending: [],
    topRated: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({...prev, loading: true, error: null}));
    try {
      const [trendingRes, topRatedRes] = await Promise.all([
        getTrending(),
        getTopRated(),
      ]);
      setState({
        trending: trendingRes.results,
        topRated: topRatedRes.results,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Something went wrong',
      }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {...state, refetch: fetchData};
}
