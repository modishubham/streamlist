import type {Genre} from '../api/types';

export type GenreChipOption = {
  id: number | null;
  label: string;
};

const DISPLAY_ORDER: {label: string; matchNames: string[]}[] = [
  {label: 'Action', matchNames: ['Action']},
  {label: 'Drama', matchNames: ['Drama']},
  {label: 'Comedy', matchNames: ['Comedy']},
  {label: 'Sci-Fi', matchNames: ['Science Fiction']},
  {label: 'Horror', matchNames: ['Horror']},
  {label: 'Documentary', matchNames: ['Documentary']},
];

export const FALLBACK_GENRE_IDS: Record<string, number> = {
  Action: 28,
  Drama: 18,
  Comedy: 35,
  'Sci-Fi': 878,
  Horror: 27,
  Documentary: 99,
};

function findGenre(genres: Genre[], matchNames: string[]): Genre | undefined {
  return genres.find(g => matchNames.includes(g.name));
}

export function buildGenreChipOptions(genres: Genre[]): GenreChipOption[] {
  const chips: GenreChipOption[] = [{id: null, label: 'All'}];
  for (const item of DISPLAY_ORDER) {
    const found = findGenre(genres, item.matchNames);
    if (found) {
      chips.push({id: found.id, label: item.label});
    } else if (FALLBACK_GENRE_IDS[item.label] !== undefined) {
      chips.push({id: FALLBACK_GENRE_IDS[item.label], label: item.label});
    }
  }
  return chips;
}

export function buildGenreNamesById(genres: Genre[]): Map<number, string> {
  const map = new Map<number, string>();
  for (const g of genres) {
    map.set(g.id, g.name);
  }
  for (const item of DISPLAY_ORDER) {
    const id = FALLBACK_GENRE_IDS[item.label];
    if (id !== undefined && !map.has(id)) {
      map.set(id, item.label);
    }
  }
  return map;
}
