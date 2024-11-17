import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Signup from './Signup';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const Signin = () => {

  const navigation = useNavigation()
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '164174130595-cc35prt58fv5us5jgfmdk520r6scicng.apps.googleusercontent.com',
    });
  }, []);

  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      // Sign in the user and get their details
      const signInResult = await GoogleSignin.signIn();

      // Extract the ID token, ensuring compatibility with different versions of the module
      const idToken = signInResult.idToken || signInResult?.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in the user with the credential
      const firebaseUserCredential = await auth().signInWithCredential(
        googleCredential,
      );

      navigation.replace('RootTab')
      console.log('Firebase User:', firebaseUserCredential.user);

      // Return the Firebase user credential
      return firebaseUserCredential.user;
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      throw error;
    }
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const Handleemail = async () => {
    try {
      const authemail = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      navigation.replace('RootTab')
      const uid = authemail.user.uid;
      const userData = {
        email: email,
        password: password,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      await firestore().collection('UsersDataBase').doc(uid).set(userData);
      console.log('User account created & signed in!');
      console.log('AuthEmail:', authemail);
      console.log('User Data stored in DB:', userData);
      console.log('UID:', uid);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      } else {
        console.error('Error creating user:', error);
      }
    }
  };

  return (
    <View>
      <View style={styles.Header}>
        <Text style={{textAlign: 'center', fontFamily: 'Sofia-Regular'}}>
          #HealthyIndia
        </Text>
      </View>
      <View style={{padding: width * 0.04, rowGap: 20}}>
        <View
          style={{
            borderBottomWidth: width * 0.001,
            marginHorizontal: height * 0.02,
            marginVertical: height * 0.02,
          }}>
          <Text>Email address</Text>
          <TextInput
            value={email}
            onChangeText={text => setEmail(text)}
            placeholderTextColor={'#000'}
            placeholder="Enter email"
          />
        </View>
        <View
          style={{
            borderBottomWidth: width * 0.001,
            marginHorizontal: height * 0.02,
          }}>
          <Text>Email Password</Text>
          <TextInput
            value={password}
            onChangeText={text => setPassword(text)}
            placeholderTextColor={'#000'}
            placeholder="Enter password"
          />
        </View>
      </View>

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity style={{height: height * 0.2}} onPress={Handleemail}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>

      <Text onPress={onGoogleButtonPress}>Google</Text>
    </View>
  );
};
export default Signin;

const styles = StyleSheet.create({
  Header: {
    height: height * 0.4,
    backgroundColor: 'orange',
    borderBottomLeftRadius: height * 0.02,
    borderBottomRightRadius: height * 0.02,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
