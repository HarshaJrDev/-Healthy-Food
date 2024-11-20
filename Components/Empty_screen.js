import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const EmptyCartScreen = ({ onShopNow }) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/Images/Empty_Cart.json')}
        autoPlay
        loop
        style={styles.lottieAnimation}
      />
      <Text style={styles.title}>Your Cart is Empty</Text>
      <Text style={styles.subtitle}>
        Looks like you haven't added anything to your cart yet.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onShopNow}>
        <Text style={styles.buttonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor:"#fff",
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 24,
    marginVertical: 12,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default EmptyCartScreen;
