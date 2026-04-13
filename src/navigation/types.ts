import type {NavigatorScreenParams} from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Watchlist: undefined;
  Profile: undefined;
};

export type MovieListMode = 'trending' | 'top_rated' | 'discover';

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList>;
  Detail: {movieId: number};
  MovieList: {
    mode: MovieListMode;
    genreId?: number;
    title: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
