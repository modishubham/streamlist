type ImageSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export function getImageUrl(
  path: string | null,
  size: ImageSize = 'w500',
): string | null {
  if (!path) {
    return null;
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
