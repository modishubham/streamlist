import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@streamlist/recent_searches';
const MAX_ENTRIES = 5;

export interface UseRecentSearchesResult {
  searches: string[];
  addSearch: (term: string) => void;
  clearAll: () => void;
}

export function useRecentSearches(): UseRecentSearchesResult {
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setSearches(parsed.slice(0, MAX_ENTRIES));
          }
        }
      })
      .catch(() => {});
  }, []);

  const persist = useCallback((next: string[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const addSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) {
        return;
      }
      setSearches(prev => {
        const deduped = prev.filter(
          s => s.toLowerCase() !== trimmed.toLowerCase(),
        );
        const next = [trimmed, ...deduped].slice(0, MAX_ENTRIES);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const clearAll = useCallback(() => {
    setSearches([]);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  return {searches, addSearch, clearAll};
}
