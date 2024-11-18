import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import store from '../Redux/ProductStore';

// Screens
import Splash from '../Screens/Splash';
import Signup from '../Auth/Signup';
import Signin from '../Auth/Signin';
import Profile from '../Screens/Profile';
import Onboarding from '../Screens/OnBoard';
import ProductDetail from '../Screens/ProductDetail';
import TabStack from '../Navigation/TabStack';
import Cart_Screen from '../Screens/Cart_Screen';

const Stack = createStackNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="Onboarding" component={Onboarding} />
    <Stack.Screen name="Signin" component={Signin} />
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="RootTab" component={TabStack} />
  </Stack.Navigator>
);

// Main Stack
const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="RootTab">
    <Stack.Screen name="RootTab" component={TabStack} />
    <Stack.Screen name="Signin" component={Signin} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="ProductDetail" component={ProductDetail} />
    <Stack.Screen name="Cart_Screen" component={Cart_Screen} />
  </Stack.Navigator>
);

// Root Stack
const RootStack = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkInitialState = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');

        setIsLogin(!!userToken); // User is logged in if a token exists
        setShowOnboarding(!hasLaunched);

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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isLogin ? (
          <MainStack />
        ) : showOnboarding ? (
          <AuthStack />
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
               <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="Onboarding" component={Onboarding} />
    <Stack.Screen name="Signin" component={Signin} />
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="RootTab" component={TabStack} />

          </Stack.Navigator>
        )}
      </NavigationContainer>
    </Provider>
  );
};

export default RootStack;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
