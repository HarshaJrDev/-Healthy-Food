import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('window');

const Salad_Spouts = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await firestore().collection('Salad_Spouts').get();
        const data = response.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(JSON.stringify(data));
        setItems(data);
      } catch (error) {
        console.log('Error fetching data from Firestore:', error);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({item}) => {
    const isAvailable = item.Item_available?.availbale
      ? 'Available'
      : 'Not Available';
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', {product: item})}>
        <Image source={{uri: item.Item_Image}} style={styles.productImage} />

        <View style={styles.cardContentMain}>
          <Text style={styles.productTitle}>{item.item_title}</Text>
          <Image
            style={styles.isAvailable}
            source={{uri: item.item_type?.item_Type.is_Veg}}
          />
        </View>
        <View style={styles.cardContent}>
          <Text numberOfLines={2} style={styles.productDescription}>
            {item.item_Description}
          </Text>
          <Text style={styles.productPrice}>₹{item.item_price || 'N/A'}</Text>
          <Text style={styles.productAvailability}>{isAvailable}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Salad_Spouts;

const styles = StyleSheet.create({
  flatListContainer: {
    paddingVertical: height * 0.02,
  },
  card: {
    height: height * 0.35,
    width: width * 0.45,
    backgroundColor: '#fff',
    margin: width * 0.025,
    borderRadius: height * 0.02,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    height: '60%',
    width: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: width * 0.03,
  },
  cardContentMain: {
    margin: height * 0.001,
    marginHorizontal: 10,
    top: height * 0.01,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.005,
  },
  productDescription: {
    fontSize: 12,
    color: '#555',
    marginBottom: height * 0.005,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: height * 0.005,
  },
  productAvailability: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  isAvailable: {
    height: height * 0.02,
    width: width * 0.05,
  },
});
