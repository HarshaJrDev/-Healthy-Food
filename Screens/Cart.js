import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore'
const { width, height } = Dimensions.get('window');

const ProfileAndCartScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name:  auth().currentUser.displayName,
    email:  auth().currentUser.email,
    phone: auth().currentUser.phoneNumber,
    avatar: auth().currentUser.photoURL, // Replace with dynamic image URL or local image
  });


  const getuserdb = async () => {

    try {

      const user = await auth().currentUser;
      const userRef = firestore().collection('UsersDataBase').doc(user.uid);
      const userData = await userRef.get();
      setUserData(userData.data());


      
    } catch (error){
      console.log(error,'while get the db is occuried error')
    }
 
  
  }

  const handleEditProfile = () => {
    console.log('Edit Profile clicked');
  };

  const handleViewOrders = () => {
    console.log('View Orders clicked');
  };

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
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={[styles.header, { width }]}>
        <Image source={{ uri: userData.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{userData.name.toLowerCase().slice(0,25)}</Text>

        <Text style={styles.email}>{userData.email}</Text>
        <Text style={styles.phone}>{userData.phone}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleEditProfile} style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleViewOrders} style={styles.button}>
          <Text style={styles.buttonText}>View Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Section */}
      <View style={[styles.cartContainer, { width }]}>
        <Text style={styles.text}>Cart</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Terms and Conditions | Privacy Policy</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.05,
  },
  avatar: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    marginBottom: height * 0.02,
  },
  name: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: width * 0.04,
    color: '#555',
    marginBottom: height * 0.01,
  },
  phone: {
    fontSize: width * 0.04,
    color: '#555',
    marginBottom: height * 0.03,
  },
  actions: {
    paddingHorizontal: width * 0.05,
  },
  button: {
    backgroundColor: '#FF5722',
    padding: height * 0.02,
    marginVertical: height * 0.01,
    borderRadius: width * 0.03,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: width * 0.04,
    color: '#fff',
    fontWeight: 'bold',
  },
  cartContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  text: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  signOutButton: {
    backgroundColor: '#ff5252',
    padding: height * 0.02,
    borderRadius: width * 0.03,
    marginTop: height * 0.02,
  },
  signOutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  footer: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  footerText: {
    fontSize: width * 0.035,
    color: '#888',
  },
});

export default ProfileAndCartScreen;
