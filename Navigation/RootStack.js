import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider, useSelector} from 'react-redux';
import store from '../Redux/ProductStore';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import Splash from '../Screens/Splash';
import Signup from '../Auth/Signup';
import Signin from '../Auth/Signin';
import Onboarding from '../Screens/OnBoard';
import ProductDetail from '../Screens/ProductDetail';
import CartScreen from '../Screens/Cart_Screen';
import HomeScreen from '../Screens/Home';
import ProfileScreen from '../Screens/Cart';
import Tracking from '../Screens/History';
import Orders from '../Screens/Cart_Screen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabRoot = () => {
  const {width, height} = Dimensions.get('window');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const metrics = {
    tabBarHeight: 50,
    iconSize: 24,
    indicatorHeight: 7,
    indicatorWidth: 40,
    borderRadius: 5,
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  const cart = useSelector(state => state.products.products);
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color}) => {
            const renderIcon = (iconName, IconComponent) => (
              <View style={{alignItems: 'center'}}>
                <IconComponent
                  name={iconName}
                  size={metrics.iconSize}
                  color={focused ? '#5E8696' : 'gray'}
                />
                {focused && (
                  <View
                    style={{
                      borderRadius: metrics.borderRadius,
                      height: metrics.indicatorHeight,
                      width: metrics.indicatorWidth,
                      backgroundColor: '#5E8696',
                      marginTop: 4,
                    }}
                  />
                )}
              </View>
            );

            if (route.name === 'Home') return renderIcon('home', Feather);
            if (route.name === 'Profile') return renderIcon('user', Icon);
            if (route.name === 'Tracking') return renderIcon('history', Icon);
            if (route.name === 'Orders')
              return renderIcon('shopping-cart', Feather);
          },
          tabBarLabel: () => null,
          tabBarActiveTintColor: '#5E8696',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            display: isKeyboardVisible ? 'none' : 'flex',
            borderRadius: metrics.borderRadius,
            height: metrics.tabBarHeight,
            backgroundColor: '#fff',
            elevation: 0,
            borderTopWidth: 0,
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen
          name="Orders"
          component={Orders}
          options={{
            tabBarBadge: cart.length > 0 ? cart.length : null, // Dynamically set badge count
          }}
        />
        <Tab.Screen name="Tracking" component={Tracking} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </KeyboardAvoidingView>
  );
};

const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="Onboarding" component={Onboarding} />
    <Stack.Screen name="Signin" component={Signin} />
    <Stack.Screen name="Signup" component={Signup} />
  </Stack.Navigator>
);

// const DrawerNavigation = () => (
//   <Drawer.Navigator
//     screenOptions={{
//   // Prevent automatic opening
//       swipeEnabled: false,  // Disable drawer swipe
//       headerShown: false    // Hide header
//     }}
//     // Optional: Further prevent drawer opening
//     initialRouteName="Home Tabs"
//   >
//     <Drawer.Screen
//       name="Home Tabs"
//       component={TabRoot}
//       options={{
//         drawerLabel: () => null,
//         drawerIcon: () => null
//       }}
//     />
//     <Drawer.Screen name="Profile" component={ProfileScreen} />
//   </Drawer.Navigator>
// );

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="TabRoot">
    <Stack.Screen name="ProductDetail" component={ProductDetail} />
    <Stack.Screen name="TabRoot" component={TabRoot} />
    <Stack.Screen name="CartScreen" component={CartScreen} />
  </Stack.Navigator>
);

const RootStack = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkInitialState = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');

        setIsLogin(!!userToken);
        setShowOnboarding(!hasLaunched);

        if (!hasLaunched) await AsyncStorage.setItem('hasLaunched', 'true');
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
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Signin" component={Signin} />
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
