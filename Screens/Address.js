import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AddAddressAndCart = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isupdate,setisupdate] = useState('')

  const fetchAddresses = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        console.error('User not logged in');
        return;
      }

      const uid = user.uid;

      const addressSnapshot = await firestore()
        .collection('UsersDataBase')
        .doc(uid)
        .collection('Addresses')
        .get();

      const addressList = addressSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAddresses(addressList);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const addAddressToDb = async () => {
    setLoading(true);
    try {
      const user = auth().currentUser;
      if (!user) {
        console.error('User not logged in');
        alert('Please log in to place an order.');
        return;
      }
  
      const userId = user.uid;
  
      // Fetch cart items dynamically from Firestore
      const cartSnapshot = await firestore()
        .collection('UsersDataBase')
        .doc(userId)
        .collection('Cart')
        .get();
  
      if (cartSnapshot.empty) {
        alert('Cart is empty. Add items to your cart before placing an order.');
        setLoading(false);
        return;
      }
  
      const cartData = cartSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // Address data
      const addressData = {
        name,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        timestamp: firestore.FieldValue.serverTimestamp(),
      };
  
      // Combine address and cart data
      const orderData = {
        address: addressData,
        cart: cartData,
      };
  
      // Log the combined order data
      console.log('Merged Order Data:', JSON.stringify(orderData, null, 2));
  
      // Save the merged data into the Orders collection
      await firestore()
        .collection('UsersDataBase')
        .doc(userId)
        .collection('Orders')
        .add(orderData);
  
      alert('Order placed successfully!');
      setLoading(false);
  
      // Optionally, clear the cart after order is placed
      const batch = firestore().batch();
      cartSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log('Cart cleared after placing the order.');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place the order.');
      setLoading(false);
    }
  };
  
  

  const deleteAddress = async id => {
    try {
      const user = auth().currentUser;
      if (!user) {
        console.error('User not logged in');
        return;
      }

      const uid = user.uid;

      await firestore()
        .collection('UsersDataBase')
        .doc(uid)
        .collection('Addresses')
        .doc(id)
        .delete();

      alert('Address deleted successfully!');
      fetchAddresses(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address.');
    }
  };
  const updateAddress = async id => {
    try {
      const user = auth().currentUser;
      if (!user) {
        console.error('User not logged in');
        return;
      }

      const uid = user.uid;

      await firestore()
        .collection('UsersDataBase')
        .doc(uid)
        .collection('Addresses')
        .doc(id)
        .update();

      alert('Address deleted successfully!');
      fetchAddresses(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address.');
    }
  };



  const renderSwipeable = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            Alert.alert('Delete Address', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', onPress: () => deleteAddress(item.id) },
            ])
          }
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
      renderLeftActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            Alert.alert('Update Address', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', onPress: () => isupdate(item.id) },
            ])
          }
        >
          <Text style={styles.deleteButtonText}>Update</Text>
        </TouchableOpacity>
      )}
    >
      <View style={styles.addressItem}>
        <Text style={styles.addressText}>{item.name}</Text>
        <Text style={styles.addressText}>{item.phone}</Text>
        <Text style={styles.addressText}>
          {item.addressLine1}, {item.addressLine2}, {item.city}, {item.state}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Address Line 1"
        value={addressLine1}
        onChangeText={setAddressLine1}
      />
      <TextInput
        style={styles.input}
        placeholder="Address Line 2"
        value={addressLine2}
        onChangeText={setAddressLine2}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="State"
        value={state}
        onChangeText={setState}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={addAddressToDb}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Saving...' : 'Save Address'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={addresses}
        keyExtractor={item => item.id}
        renderItem={renderSwipeable}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  list: {
    marginTop: 16,
  },
  addressItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddAddressAndCart;
