import type {Movie} from '../api/types';

export function formatMovieSubtitle(
  movie: Movie,
  genreNamesById: Map<number, string>,
): string {
  const year = movie.release_date?.slice(0, 4) ?? '—';
  const gid = movie.genre_ids[0];
  const genreName =
    gid !== undefined
      ? genreNamesById.get(gid) ?? 'Film'
      : 'Film';
  return `${year} • ${genreName}`;
}
