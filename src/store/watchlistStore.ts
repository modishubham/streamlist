import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Movie} from '../api/types';

interface WatchlistState {
  items: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWatchlist: (movie: Movie) => {
        const exists = get().items.some(m => m.id === movie.id);
        if (!exists) {
          set(state => ({items: [...state.items, movie]}));
        }
      },

      removeFromWatchlist: (movieId: number) => {
        set(state => ({
          items: state.items.filter(m => m.id !== movieId),
        }));
      },

      isInWatchlist: (movieId: number) => {
        return get().items.some(m => m.id === movieId);
      },
    }),
    {
      name: 'streamlist-watchlist',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
