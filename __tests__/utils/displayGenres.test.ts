import {
  buildGenreChipOptions,
  buildGenreNamesById,
  FALLBACK_GENRE_IDS,
} from '../../src/utils/displayGenres';
import type {Genre} from '../../src/api/types';

const sampleApiGenres: Genre[] = [
  {id: 28, name: 'Action'},
  {id: 18, name: 'Drama'},
  {id: 35, name: 'Comedy'},
  {id: 878, name: 'Science Fiction'},
  {id: 27, name: 'Horror'},
  {id: 99, name: 'Documentary'},
];

describe('buildGenreChipOptions', () => {
  it('places All first and preserves chip order with API ids', () => {
    const chips = buildGenreChipOptions(sampleApiGenres);
    expect(chips[0]).toEqual({id: null, label: 'All'});
    expect(chips.map(c => c.label)).toEqual([
      'All',
      'Action',
      'Drama',
      'Comedy',
      'Sci-Fi',
      'Horror',
      'Documentary',
    ]);
    expect(chips.find(c => c.label === 'Sci-Fi')).toEqual({
      id: 878,
      label: 'Sci-Fi',
    });
  });

  it('falls back to known TMDB ids when the API list is empty', () => {
    const chips = buildGenreChipOptions([]);
    expect(chips[0]).toEqual({id: null, label: 'All'});
    expect(chips.find(c => c.label === 'Action')?.id).toBe(
      FALLBACK_GENRE_IDS.Action,
    );
  });
});

describe('buildGenreNamesById', () => {
  it('includes API names and fallback labels for known ids', () => {
    const map = buildGenreNamesById(sampleApiGenres);
    expect(map.get(878)).toBe('Science Fiction');
    const emptyMap = buildGenreNamesById([]);
    expect(emptyMap.get(FALLBACK_GENRE_IDS['Sci-Fi'])).toBe('Sci-Fi');
  });
});
