import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  increaseProduct,
  decreaseProduct,
  removeFromCart,
  clearCart,
} from '../Redux/ProductSlice';
import EmptyCartScreen from '../Components/Empty_screen';
import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

const CartScreen = () => {
  const cart = useSelector(state => state.products.products); // Get cart products from Redux
  const dispatch = useDispatch();
  console.log('Cart Data:', JSON.stringify(cart, null, 2));



 
const handleaddtocartdb = async ()=>{

  const user = auth().currentUser;
  const uid = user.uid;
  console.log(uid);

 
  try {

    await firestore().collection('UsersDataBase').doc(uid).set(
     { cart:cart},{merge:true}

    )

    console.log('Cart added successfully to the database.');
    
  } catch (error) {
    
    console.log(error,'is error while adding to cart');
  }


  useEffect(() => {
    handleaddtocartdb
    return () => {
      
    };
  }, []);
}


  // Calculate subtotal, tax, and total
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% tax
  const deliveryCharge = 50; // Flat delivery charge
  const total = subtotal + tax + deliveryCharge;

  // Function to handle removing a product
  const handleRemove = product => {
    dispatch(removeFromCart(product));
    Alert.alert('Removed', `${product.title} has been removed from your cart.`);
  };

  // Function to clear the cart
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleBuyNow = () => {
    Alert.alert('Success', 'Your order has been placed!');
  };

  const handleAddress = () => {
    Alert.alert('Address', 'Navigate to Address Selection Screen!');
  };

  const renderItem = ({item}) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => dispatch(decreaseProduct(item))}
            style={styles.quantityButton}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => dispatch(increaseProduct(item))}
            style={styles.quantityButton}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => handleRemove(item)}
          style={styles.removeButton}>
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
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.billSection}>
            <Text style={styles.billText}>Subtotal: ₹{subtotal.toFixed(2)}</Text>
            <Text style={styles.billText}>Tax (5%): ₹{tax.toFixed(2)}</Text>
            <Text style={styles.billText}>Delivery Charges: ₹{deliveryCharge.toFixed(2)}</Text>
            <Text style={styles.totalText}>Total: ₹{total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.addressButton} onPress={handleAddress}>
            <Text style={styles.addressText}>Select Address</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyNowButton} onPress={handleaddtocartdb}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.clearCartButton}
            onPress={handleClearCart}>
            <Text style={styles.clearCartText}>Clear Cart</Text>
          </TouchableOpacity>
        </>
      ) : (
        <EmptyCartScreen />
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
  billSection: {
    padding: width * 0.05,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  billText: {
    fontSize: 16,
    marginBottom: height * 0.005,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: height * 0.01,
    color: '#333',
  },
  addressButton: {
    backgroundColor: '#3498db',
    paddingVertical: height * 0.015,
    marginHorizontal: width * 0.1,
    marginTop: height * 0.02,
    borderRadius: height * 0.02,
    alignItems: 'center',
  },
  addressText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buyNowButton: {
    backgroundColor: '#27ae60',
    paddingVertical: height * 0.02,
    marginHorizontal: width * 0.1,
    marginTop: height * 0.02,
    borderRadius: height * 0.02,
    alignItems: 'center',
  },
  buyNowText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
});
