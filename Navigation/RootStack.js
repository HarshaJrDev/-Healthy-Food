import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import store from '../Redux/ProductStore';
import DrawerNavigation from '../Drawer/DrawerNavigation.js';
import Cart_Screen from '../Screens/Cart_Screen';

// Import your screens
import Splash from '../Screens/Splash';
import Signup from '../Auth/Signup';
import Signin from '../Auth/Signin.js';
import Profile from '../Screens/Profile';
import Onboarding from '../Screens/OnBoard';
import ProductDetail from '../Screens/ProductDetail.js';
import TabStack from '../Navigation/TabStack.js';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="Onboarding" component={Onboarding} />
    <Stack.Screen name="Signin" component={Signin} />
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="ProductDetail" component={ProductDetail} />
    <Stack.Screen name="RootTab" component={TabStack} />
   
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='RootTab'>
    <Stack.Screen name="RootTab" component={TabStack} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="ProductDetail" component={ProductDetail} />
    <Stack.Screen name="Cart_Screen" component={Cart_Screen} />
    
  </Stack.Navigator>
);

const RootStack = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInitialState = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');

        setIsLogin(!!userToken); // User is logged in if a token exists

        if (!hasLaunched) {
          await AsyncStorage.setItem('hasLaunched', 'true');
        }
      } catch (error) {
        console.error('Error checking initial state:', error);
      } finally {
        setLoading(false);
      }
    };

    checkInitialState();
  }, []);

  if (loading) {
    return null; // You can replace this with a loading indicator if desired
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isLogin ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </Provider>
  );
};

export default RootStack;

const styles = StyleSheet.create({});
