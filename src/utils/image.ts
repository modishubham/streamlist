import {TMDB_IMAGE_BASE_URL} from '@env';

type ImageSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';

export function getImageUrl(
  path: string | null,
  size: ImageSize = 'w500',
): string | null {
  if (!path) {
    return null;
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
