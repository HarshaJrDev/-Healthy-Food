import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { increaseProduct, decreaseProduct, removeFromCart, clearCart } from '../Redux/ProductSlice';
import LottieView from 'lottie-react-native';
const { width, height } = Dimensions.get('window');

const CartScreen = () => {
  const cart = useSelector((state) => state.products.products); // Get cart products from Redux
  const dispatch = useDispatch();

  // Function to handle removing a product
  const handleRemove = (product) => {
    dispatch(removeFromCart(product));
    Alert.alert('Removed', `${product.title} has been removed from your cart.`);
  };

  // Function to clear the cart
  const handleClearCart = () => {
    dispatch(clearCart());
    Alert.alert('Success', 'Your cart has been cleared.');
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => dispatch(decreaseProduct(item))} style={styles.quantityButton}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => dispatch(increaseProduct(item))} style={styles.quantityButton}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleRemove(item)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
          <TouchableOpacity style={styles.clearCartButton} onPress={handleClearCart}>
            <Text style={styles.clearCartText}>Clear Cart</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View>
                  <LottieView source={require('../assets/Images/Empty_Cart.json')} autoPlay loop />

        </View>

      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: width * 0.05,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: height * 0.02,
    borderRadius: height * 0.01,
    backgroundColor: '#f8f8f8',
    padding: width * 0.03,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: width * 0.2,
    height: height * 0.1,
    borderRadius: height * 0.01,
    marginRight: width * 0.05,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: height * 0.005,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5E8696',
    marginBottom: height * 0.01,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  quantityButton: {
    width: width * 0.07,
    height: width * 0.07,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.035,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: width * 0.03,
  },
  removeButton: {
    marginTop: height * 0.01,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    backgroundColor: '#ff5c5c',
    borderRadius: height * 0.01,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  clearCartButton: {
    backgroundColor: '#5E8696',
    paddingVertical: height * 0.02,
    marginHorizontal: width * 0.1,
    marginBottom: height * 0.02,
    borderRadius: height * 0.02,
    alignItems: 'center',
  },
  clearCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    marginTop: height * 0.3,
    color: '#333',
  },
});
