import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

const RazorpayPayment = () => {

  // Function to initiate the Razorpay payment
  const initiatePayment = () => {

    // Razorpay payment options
    const options = {
      description: 'Test Payment',
      image: 'https://example.com/your_logo.png',
      currency: 'INR', // Ensure the currency is correct
      key: 'rzp_test_b0teA3IxQVsifq', // Replace with your Razorpay Key
      amount: '1000', // Amount in paise (1000 = 10 INR)
      name: '#HealthyIndia',
      prefill: {
        email: 'test@example.com',
        contact: '9999999999',
        name: 'Test User',
      },
      theme: { color: '#F37254' },
    };

    // Open Razorpay Checkout
    RazorpayCheckout.open(options)
      .then((data) => {
        // Payment Success
        console.log('Payment Success:', data);
        Alert.alert('Payment Successful', `Payment ID: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        // Enhanced error handling
        console.error('Payment Error:', error);
        let errorMessage = 'Payment Failed';
        if (error.code) {
          errorMessage = `Error Code: ${error.code}`;
        }
        if (error.description) {
          errorMessage = `Error: ${error.description}`;
        }
        Alert.alert('Payment Failed', errorMessage);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Razorpay Payment</Text>
      <Button title="Pay Now" onPress={initiatePayment} />
    </View>
  );
};

export default RazorpayPayment;
