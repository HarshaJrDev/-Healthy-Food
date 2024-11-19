import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../Redux/ProductSlice'; // Import the action

const { width, height } = Dimensions.get('window');

const ProductDetail = ({ route }) => {
  const { product } = route.params; // Passed product data
  const dispatch = useDispatch();

  // Function to handle adding to cart
  const handleAddToCart = () => {
    dispatch(addToCart(product)); // Dispatch action with product payload
    Alert.alert('Success', `${product.item_title || 'Item'} has been added to your cart!`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <Image
      source={
        product.Item_Image
          ? { uri: product.Item_Image } // Use URI for dynamic images
          : { uri: 'https://via.placeholder.com/150/FFB6C1/000000?text=Food+Placeholder' } // Fallback image
      }
      
        style={styles.productImage}
      />
      
      {/* Product Details */}
      <View style={styles.detailContainer}>
        <Text style={styles.productTitle}>{product.item_title || 'Unknown Item'}</Text>
        <Text style={styles.productPrice}>
          ₹{product.item_price }
        </Text>
        <Text style={styles.productDescription}>
          {product.item_Description || 'No description available.'}
        </Text>
      </View>

      {/* Add to Cart Button */}
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
    width: '100%',
    height: height * 0.4,
    resizeMode: 'cover',
  },
  detailContainer: {
    padding: width * 0.05,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    elevation: 5,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FA4A0C',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: '#666',
    marginBottom: 15,
  },
  addToCartButton: {
    backgroundColor: '#FA4A0C',
    paddingVertical: height * 0.02,
    marginHorizontal: width * 0.1,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: height * 0.02,
    elevation: 3,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
