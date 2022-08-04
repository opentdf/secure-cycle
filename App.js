import React, { useEffect } from 'react';
import { NativeBaseProvider, ColorMode } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux'

import SecureCycle from './SecureCycle'
import theme from './theme';
import { store } from './store/store'

export default ({ children, defaultTheme }) => {

  const colorModeManager = {
    get: async () => {
      try {
        let val = await AsyncStorage.getItem('@secure-cycle-color-mode');
        return val === 'dark' ? 'dark' : 'light';
      } catch (e) {
        console.log(e);
        return 'light';
      }
    },
    set: async (value) => {
      try {
        await AsyncStorage.setItem('@secure-cycle-color-mode', value);
      } catch (e) {
        console.log(e);
      }
    },
  };
  return (
    <ReduxProvider store={store}>
      <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
        <NavigationContainer>
          <SecureCycle />
        </NavigationContainer>
      </NativeBaseProvider>
    </ReduxProvider>
  );
};