import client from './client';
import type {
  CreditsResponse,
  Genre,
  GenreListResponse,
  Movie,
  MovieDetail,
  PaginatedResponse,
} from './types';

export async function getTrending(
  page = 1,
): Promise<PaginatedResponse<Movie>> {
  const {data} = await client.get<PaginatedResponse<Movie>>(
    '/trending/movie/week',
    {params: {page}},
  );
  return data;
}

export async function getTopRated(
  page = 1,
): Promise<PaginatedResponse<Movie>> {
  const {data} = await client.get<PaginatedResponse<Movie>>(
    '/movie/top_rated',
    {params: {page}},
  );
  return data;
}

export async function searchMovies(
  query: string,
  page = 1,
): Promise<PaginatedResponse<Movie>> {
  const {data} = await client.get<PaginatedResponse<Movie>>(
    '/search/movie',
    {params: {query, page}},
  );
  return data;
}

export async function getMovieDetail(movieId: number): Promise<MovieDetail> {
  const {data} = await client.get<MovieDetail>(`/movie/${movieId}`);
  return data;
}

export async function getMovieGenres(): Promise<Genre[]> {
  const {data} = await client.get<GenreListResponse>('/genre/movie/list');
  return data.genres;
}

export async function getMovieCredits(
  movieId: number,
): Promise<CreditsResponse> {
  const {data} = await client.get<CreditsResponse>(
    `/movie/${movieId}/credits`,
  );
  return data;
}

export async function getSimilarMovies(
  movieId: number,
): Promise<PaginatedResponse<Movie>> {
  const {data} = await client.get<PaginatedResponse<Movie>>(
    `/movie/${movieId}/similar`,
  );
  return data;
}

export type DiscoverMoviesOptions = {
  sortBy?: string;
  /** TMDB `vote_count.gte` — useful when sorting by vote average */
  voteCountGte?: number;
};

export async function discoverMovies(
  page = 1,
  withGenresId?: number,
  options?: DiscoverMoviesOptions,
): Promise<PaginatedResponse<Movie>> {
  const params: Record<string, string | number> = {page};
  if (withGenresId !== undefined) {
    params.with_genres = withGenresId;
  }
  if (options?.sortBy !== undefined) {
    params.sort_by = options.sortBy;
  }
  if (options?.voteCountGte !== undefined) {
    params['vote_count.gte'] = options.voteCountGte;
  }
  const {data} = await client.get<PaginatedResponse<Movie>>(
    '/discover/movie',
    {params},
  );
  return data;
}
