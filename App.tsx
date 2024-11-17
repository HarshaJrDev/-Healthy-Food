import 'react-native-gesture-handler';
import { Platform } from 'react-native';
import React from 'react';
import RootStack from '../Healthyfood/Navigation/RootStack';
if (Platform.OS !== 'web') {
  require('react-native-gesture-handler');
}

const App = () => {
  return (
    <RootStack />
  );
};
export default App;

