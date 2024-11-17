import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../Screens/Home'; 
const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  return (
   <Drawer.Navigator screenOptions={{headerShown:false}} >
      <Drawer.Screen name="RootTab" component={HomeScreen} />
   </Drawer.Navigator>
  )
}

export default DrawerNavigation

const styles = StyleSheet.create({})