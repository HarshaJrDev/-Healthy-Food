import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const splashtimout = setTimeout(() => {
      navigation.navigate('Onboarding');
    }, [2000]);
    return () => clearTimeout(splashtimout);
  }, [navigation]);
  return (
    <View style={{backgroundColor: '#10375E', flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            textAlign: 'center',
            color: '#FFA249',
            fontSize: 30,
            fontFamily: 'Sofia-Regular',
          }}>
          #HealthyIndia
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
