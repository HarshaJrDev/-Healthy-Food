import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  increaseProduct,
  decreaseProduct,
  removeFromCart,
  clearCart,
} from '../Redux/ProductSlice';
import EmptyCartScreen from '../Components/Empty_screen';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import Feather from 'react-native-vector-icons/Feather';
const {width, height} = Dimensions.get('window');

const CartScreen = () => {
  const navigation = useNavigation();
  const cart = useSelector(state => state.products.products); // Get cart products from Redux
  const dispatch = useDispatch();
  console.log('Cart Data:', JSON.stringify(cart, null, 2));

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
      theme: {color: '#F37254'},
    };

    // Open Razorpay Checkout
    RazorpayCheckout.open(options)
      .then(data => {
        // Payment Success
        console.log('Payment Success:', data);
        Alert.alert(
          'Payment Successful',
          `Payment ID: ${data.razorpay_payment_id}`,
        );
      })
      .catch(error => {
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

  const handleaddtocartdb = async () => {
    try {
      const user = auth().currentUser;
      const uid = user.uid;
      console.log(uid);
      await firestore()
        .collection('UsersDataBase')
        .doc(uid)
        .set({cart: cart}, {merge: true});

      console.log('Cart added successfully to the database.');
    } catch (error) {
      console.log(error, 'is error while adding to cart');
    }
  };
  const subtotal = cart.reduce(
    (sum, item) => sum + item.item_price * item.quantity,
    0,
  );
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
    navigation.navigate('Address');
  };

  const renderItem = ({item}) => (
    <View style={styles.cartItem}>
      <Image source={{uri: item.Item_Image}} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.item_title}</Text>
        <Text style={styles.productPrice}>₹{item.item_price}</Text>
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

    <ScrollView style={styles.container}  >
         <View style={styles.container}>
      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />

          <View style={{height:1,width:"95%",backgroundColor:"#d1d1d1",marginHorizontal:height*0.01}}/>
<View style={styles.billSection}>
  <View style={styles.billItem}>
    <Text style={styles.billLabel}>Subtotal:</Text>
    <Text style={styles.billValue}>₹{subtotal.toFixed(2)}</Text>
  </View>
  <View style={styles.billItem}>
    <Text style={styles.billLabel}>Tax (5%):</Text>
    <Text style={styles.billValue}>₹{tax.toFixed(2)}</Text>
  </View>
  <View style={styles.billItem}>
    <Text style={styles.billLabel}>Delivery Charges:</Text>
    <Text style={styles.billValue}>₹{deliveryCharge.toFixed(2)}</Text>
  </View>
  <View style={styles.billItem}>
    <Text style={styles.billLabel}>Total:</Text>
    <Text style={styles.billValue}>₹{total.toFixed(2)}</Text>
  </View>
</View>

<View style={styles.paymentSection}>
  <Text style={styles.paymentTitle}>Choose Payment Method</Text>

  {/* Payment Option 1 */}
  <TouchableOpacity style={styles.paymentOption}>
    <Text style={styles.paymentOptionText}>Credit/Debit Card</Text>
    <View style={styles.paymentOptionIcon}>
      {/* You can replace with actual icons */}
      <Text>💳</Text>
    </View>
  </TouchableOpacity>

  {/* Payment Option 2 */}
  <TouchableOpacity style={styles.paymentOption}>
    <Text style={styles.paymentOptionText}>PayPal</Text>
    <View style={styles.paymentOptionIcon}>
      {/* Replace with PayPal icon */}
      <Text>💰</Text>
    </View>
  </TouchableOpacity>

  {/* Payment Button */}
  <TouchableOpacity style={styles.paymentButton}  onPress={handleaddtocartdb} >
    <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
  </TouchableOpacity>
</View>


          {/* <TouchableOpacity
            style={styles.addressButton}
            onPress={handleAddress}>
            <Text style={styles.addressText}>Select Address</Text>
          </TouchableOpacity> */}

       
        </>
      ) : (
        <View style={{bottom:-height*0.2}} >
                  <EmptyCartScreen/>

        </View>

      )}
    </View>

    </ScrollView>
 
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
 // Added some padding to prevent content from touching the edges
  },
  listContainer: {

  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: height * 0.02,
    borderRadius: 12, // Rounded corners for a soft look
    backgroundColor: '#f9f9f9', // Lighter background for less contrast
    padding: width * 0.04,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,  // Reduced shadow opacity for subtle effect
    shadowRadius: 6, // More subtle shadow
    elevation: 2, // Lighter shadow for iOS
  },
  productImage: {
    width: width * 0.22,
    height: height * 0.12,
    borderRadius: 10,  // Rounded image for a soft look
    marginRight: width * 0.05,
    backgroundColor: '#e0e0e0',  // Placeholder background color
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18, // Slightly larger title for prominence
    fontWeight: '600',
    color: '#333', // Darker color for better readability
    marginBottom: height * 0.005,
  },
  productPrice: {
    fontSize: 16, // Slightly larger price text for clarity
    fontWeight: '500',
    color: '#4E9FD1',  // More modern blue for pricing
    marginBottom: height * 0.01,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  quantityButton: {
    width: width * 0.08,
    height: width * 0.08,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.04,
    shadowColor: '#000',
    shadowOpacity: 0.1,  // Added subtle shadow to the buttons
    shadowRadius: 5, 
    elevation: 2,
  },
  quantityText: {
    fontSize: 20,  // Larger size for better touch target
    fontWeight: '600',
    color: '#333',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',  // Same color as title for consistency
    marginHorizontal: width * 0.03,
  },
  removeButton: {
    marginTop: height * 0.01,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#FF6B6B', // More vibrant remove button color
    borderRadius: height * 0.01,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  billSection: {
    padding: 16, 
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8, 
    borderBottomWidth: 1,  // Added separator between bill items
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  billLabel: {
    fontSize: 16,
    color: '#333', 
  },
  billValue: {
    fontSize: 16,
    color: '#333', 
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700', // Bold for emphasis on total
    color: '#333',
    marginTop: 12, 
  },
  addressButton: {
    backgroundColor: '#3498db',
    paddingVertical: height * 0.02,
    marginHorizontal: width * 0.15,  // Increased margin for better spacing
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
    backgroundColor: '#FF6B6B',
    marginHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderRadius: height * 0.02,
    alignItems: 'center',
    height: height * 0.065,
    width: width * 0.9,
    justifyContent: 'center',  // Center the text inside the button
    flexDirection: 'row',
  },
  paymentSection: {
    padding: width * 0.04,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginTop: height * 0.02,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: height * 0.01,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#333',
  },
  paymentOptionIcon: {
    width: width * 0.08,
    height: width * 0.08,
    backgroundColor: '#e0e0e0',
    borderRadius: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: height * 0.02,
    marginTop: height * 0.02,
    borderRadius: height * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  buyNowText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700', // Bold text for prominence
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

