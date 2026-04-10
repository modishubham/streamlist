import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import {colors} from './src/theme/colors';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: colors.primary,
            background: colors.surface,
            card: colors.surface_container_low,
            text: colors.on_surface,
            border: colors.outline_variant,
            notification: colors.primary_container,
          },
          fonts: {
            regular: {fontFamily: 'InterRegular', fontWeight: '400'},
            medium: {fontFamily: 'InterRegular', fontWeight: '400'},
            bold: {fontFamily: 'ManropeBold', fontWeight: '700'},
            heavy: {fontFamily: 'ManropeExtraBold', fontWeight: '800'},
          },
        }}>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
