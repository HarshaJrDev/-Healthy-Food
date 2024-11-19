import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = ({navigation}) => {
  const handleSignOut = async () => {
    try {
      await auth().signOut();

      await AsyncStorage.removeItem('userToken');

      console.log('User signed out successfully');

      navigation.replace('Signin');
    } catch (error) {
      console.error('Error during sign out:', error);
      Alert.alert('Error', 'Unable to sign out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cart</Text>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#ff5252',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  signOutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
