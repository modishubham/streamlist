import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import DetailScreen from '../screens/DetailScreen';
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

function TabsScreen() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          paddingTop: spacing.xs,
        },
        tabBarLabelStyle: {
          ...typography.label_sm,
          textTransform: 'uppercase',
        },
        tabBarActiveTintColor: colors.primary_container,
        tabBarInactiveTintColor: colors.on_surface,
        tabBarIcon: ({focused, color}) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.default;
          return (
            <Icon name={iconName} size={TAB_ICON_SIZE} color={color ?? colors.on_surface} />
          );
        },
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
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}
