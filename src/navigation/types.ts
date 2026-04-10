import type {NavigatorScreenParams} from '@react-navigation/native';

export type HomeStackParamList = {
  HomeMain: undefined;
  Detail: {movieId: number};
};

export type SearchStackParamList = {
  SearchMain: undefined;
  Detail: {movieId: number};
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Search: NavigatorScreenParams<SearchStackParamList>;
  Watchlist: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
