import {useCallback, useEffect, useRef, useState} from 'react';
import {ApiClientError} from '../api/client';
import {discoverMovies, getTopRated, getTrending} from '../api/movies';
import type {Movie, PaginatedResponse} from '../api/types';
import type {MovieListMode} from '../navigation/types';
import type {UsePaginatedMoviesResult} from './types';


function normalizeError(err: unknown): string {
  return err instanceof ApiClientError ? err.message : 'Something went wrong';
}

export function usePaginatedMovieList(
  resetKey: unknown,
  fetchPage: (page: number) => Promise<PaginatedResponse<Movie>>,
): UsePaginatedMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;

  const pageRef = useRef(0);
  const totalPagesRef = useRef(1);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPageRef.current(1);
        if (cancelled) {
          return;
        }
        setMovies(res.results);
        const newPage = 1;
        setPage(newPage);
        pageRef.current = newPage;
        setTotalPages(res.total_pages);
        totalPagesRef.current = res.total_pages;
      } catch (err) {
        if (cancelled) {
          return;
        }
        setMovies([]);
        setPage(0);
        pageRef.current = 0;
        setError(normalizeError(err));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resetKey]);

  const appendNextPage = useCallback(async (): Promise<void> => {
    if (loadingMoreRef.current) {
      return;
    }
    const currentPage = pageRef.current;
    const tp = totalPagesRef.current;
    if (currentPage === 0 || currentPage >= tp) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);
    setError(null);
    try {
      const res = await fetchPageRef.current(currentPage + 1);
      setMovies(prev => [...prev, ...res.results]);
      const nextPage = currentPage + 1;
      setPage(nextPage);
      pageRef.current = nextPage;
      setTotalPages(res.total_pages);
      totalPagesRef.current = res.total_pages;
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, []);

  return {
    movies,
    page,
    totalPages,
    loading,
    loadingMore,
    error,
    appendNextPage,
  };
}

export function usePaginatedTrending(): UsePaginatedMoviesResult {
  const fetchPage = useCallback((p: number) => getTrending(p), []);
  return usePaginatedMovieList('trending', fetchPage);
}

export function usePaginatedTopRated(): UsePaginatedMoviesResult {
  const fetchPage = useCallback((p: number) => getTopRated(p), []);
  return usePaginatedMovieList('top_rated', fetchPage);
}

export function useDiscoverMovies(
  withGenresId: number | null,
): UsePaginatedMoviesResult {
  const fetchPage = useCallback(
    (p: number) => discoverMovies(p, withGenresId ?? undefined),
    [withGenresId],
  );
  return usePaginatedMovieList(withGenresId, fetchPage);
}

export function useMovieList(
  mode: MovieListMode,
  genreId?: number | null,
): UsePaginatedMoviesResult {
  const fetchPage = useCallback(
    (p: number) => {
      if (mode === 'trending') {
        return getTrending(p);
      }
      if (mode === 'top_rated') {
        return getTopRated(p);
      }
      return discoverMovies(p, genreId ?? undefined);
    },
    [mode, genreId],
  );
  const resetKey =
    mode === 'discover' ? `discover:${genreId ?? 'all'}` : mode;
  return usePaginatedMovieList(resetKey, fetchPage);
}
