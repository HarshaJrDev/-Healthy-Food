import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Keyboard, View, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/Home';
import Profile from '../Screens/Like';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Tracking from '../Screens/History';
import Orders from '../Screens/Profile';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const Tab = createBottomTabNavigator();

const TabRoot = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Define metrics directly in the component
  const metrics = {
    screenWidth: width,
    screenHeight: height,
    tabBarHeight: 70,
    tabBarMargin: 20,
    iconSize: 24,  // Adjust as needed
    indicatorHeight: 7,
    indicatorWidth: 40,
    borderRadius: 5,
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Tab.Navigator initialRouteName='Home'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const iconSize = metrics.iconSize;
            const indicatorStyle = {
              borderRadius: metrics.borderRadius,
              height: metrics.indicatorHeight,
              width: metrics.indicatorWidth,
              backgroundColor: '#5E8696',
              marginTop: 4,
            };

            const renderIcon = (iconName, IconComponent) => (
              <View style={{ alignItems: 'center' }}>
                <IconComponent 
                  name={iconName} 
                  size={iconSize} 
                  color={focused ? "#5E8696" : "#5E8696"} 
                />
                {focused && <View style={indicatorStyle} />}
              </View>
            );

            if (route.name === 'Home') {
              return renderIcon('home', Feather);
            }
            if (route.name === 'Profile') {
              return renderIcon('user', Icon);
            }
            if (route.name === 'Tracking') {
              return renderIcon('map-marker', Icon);
            }
            if (route.name === 'Orders') {
              return renderIcon('box', Feather);
            }
          },
          tabBarLabel: () => null,
          tabBarActiveTintColor: '#5E8696',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          
          tabBarStyle: {
            display: isKeyboardVisible ? 'none' : 'flex',
            borderRadius: metrics.borderRadius,
            bottom: metrics.tabBarMargin,
            height: metrics.tabBarHeight,
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Added transparency
            marginLeft: metrics.tabBarMargin,
            marginRight: metrics.tabBarMargin,
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
            borderTopWidth: 0, // Remove top border
          },
          tabBarBackgroundStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Orders" component={Orders} />
        <Tab.Screen name="Tracking" component={Tracking} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </KeyboardAvoidingView>
  );
};

export default TabRoot;