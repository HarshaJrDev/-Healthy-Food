import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../Redux/ProductSlice'; // Import the action
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const ProductDetail = ({ route }) => {
  const { product } = route.params; // Passed product data
  const dispatch = useDispatch();

  // Function to handle adding to cart
  const handleAddToCart = () => {
    dispatch(addToCart(product)); // Dispatch action with product payload
    <LottieView style={styles.lottieAnimation} source={require('../assets/Images/Empty_Cart.json')} autoPlay loop />

  };

  console.log(product);
  return (
    <ScrollView style={styles.container}>
      <Image source={product.image} style={styles.productImage} />
      <View style={styles.detailContainer}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default ProductDetail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productImage: {
    width: width,
    height: height * 0.4,
  },
  detailContainer: {
    padding: width * 0.05,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: height * 0.01,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5E8696',
    marginBottom: height * 0.02,
  },
  productDescription: {
    fontSize: 16,
    color: '#333',
  },
  addToCartButton: {
    backgroundColor: '#5E8696',
    paddingVertical: height * 0.02,
    marginHorizontal: width * 0.1,
    marginVertical: height * 0.02,
    borderRadius: height * 0.02,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  lottieAnimation: {
    width: width * 0.6,
    height: height * 0.4,
  }
});
