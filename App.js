import React, { useEffect } from 'react';
import { NativeBaseProvider, ColorMode } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import SecureCycle from './SecureCycle'
import theme from './theme';


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
    <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
      <NavigationContainer>
        <SecureCycle />
      </NavigationContainer>
    </NativeBaseProvider>
  );
};