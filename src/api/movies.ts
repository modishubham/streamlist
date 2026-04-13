import client from './client';
import type {
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

export async function discoverMovies(
  page = 1,
  withGenresId?: number,
): Promise<PaginatedResponse<Movie>> {
  const params: Record<string, number> = {page};
  if (withGenresId !== undefined) {
    params.with_genres = withGenresId;
  }
  const {data} = await client.get<PaginatedResponse<Movie>>(
    '/discover/movie',
    {params},
  );
  return data;
}
