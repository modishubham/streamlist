import type {Movie} from '../api/types';

export interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UsePaginatedMoviesResult {
  movies: Movie[];
  page: number;
  totalPages: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  appendNextPage: () => Promise<void>;
}
