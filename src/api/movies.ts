import client from './client';
import type {Movie, MovieDetail, PaginatedResponse} from './types';

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
