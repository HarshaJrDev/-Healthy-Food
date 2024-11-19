import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const History = () => {
  useEffect(() => {
    const getUserHistory = async () => {
      try {
        const getUid = auth().currentUser.uid;
        const userDoc = await firestore()
          .collection('UsersDataBase')
          .doc(getUid)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          console.log('User data:', userData);
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    getUserHistory();
  }, []);

  return (
    <View>
      <Text>History</Text>
    </View>
  );
};

export default History;

const styles = StyleSheet.create({});
