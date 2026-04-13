import React, {type ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import DetailScreen from '../screens/DetailScreen';
import MovieListScreen from '../screens/MovieListScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import type {RootTabParamList, RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, {focused: string; default: string}> = {
  Home: {focused: 'home', default: 'home-outline'},
  Search: {focused: 'search', default: 'search-outline'},
  Watchlist: {focused: 'bookmark', default: 'bookmark-outline'},
  Profile: {focused: 'person', default: 'person-outline'},
};

const TAB_ICON_SIZE = 24;

function TabBarBackground() {
  return <View style={tabBarBgStyles.fill} />;
}

const tabBarBgStyles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.tab_bar_surface,
  },
});

function renderTabBarBackground() {
  return <TabBarBackground />;
}

function TabBarIcon({
  routeName,
  focused,
  color,
}: {
  routeName: keyof RootTabParamList;
  focused: boolean;
  color?: string;
}) {
  const icons = TAB_ICONS[routeName];
  const iconName = focused ? icons.focused : icons.default;
  return (
    <Icon
      name={iconName}
      size={TAB_ICON_SIZE}
      color={color ?? colors.on_surface_variant}
    />
  );
}

type TabBarIconFactoryProps = {focused: boolean; color?: string};

const TAB_BAR_ICON: {
  [K in keyof RootTabParamList]: (
    props: TabBarIconFactoryProps,
  ) => ReactElement;
} = {
  Home: ({focused, color}) => (
    <TabBarIcon routeName="Home" focused={focused} color={color} />
  ),
  Search: ({focused, color}) => (
    <TabBarIcon routeName="Search" focused={focused} color={color} />
  ),
  Watchlist: ({focused, color}) => (
    <TabBarIcon routeName="Watchlist" focused={focused} color={color} />
  ),
  Profile: ({focused, color}) => (
    <TabBarIcon routeName="Profile" focused={focused} color={color} />
  ),
};

function TabsScreen() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarBackground: renderTabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          paddingTop: spacing.xs,
          elevation: 0,
        },
        tabBarLabelStyle: {
          ...typography.label_sm,
          textTransform: 'uppercase',
        },
        tabBarActiveTintColor: colors.primary_container,
        tabBarInactiveTintColor: colors.on_surface_variant,
        tabBarIcon: TAB_BAR_ICON[route.name],
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.surface},
      }}>
      <Stack.Screen name="Tabs" component={TabsScreen} />
      <Stack.Screen
        name="MovieList"
        component={MovieListScreen}
        options={({route}) => ({
          headerShown: true,
          headerTitle: route.params.title,
          headerStyle: {backgroundColor: colors.surface},
          headerTintColor: colors.primary_container,
          headerTitleStyle: {...typography.title_lg, color: colors.on_surface},
        })}
      />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}
