import React from 'react';
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
const {width, height} = Dimensions.get('window');

const Salad_Spouts = () => {
  const navigation = useNavigation();
  const addposter = [
    {
      id: 1,
      title: 'Delicious Food',
      image: require('../../Healthyfood/assets/Images/Poster/Spouts.jpg'),
      price: 25,
      description: 'A delicious mix of fresh sprouts and vegetables.',
    },
    {
      id: 2,
      title: 'Healthy Snacks',
      image: require('../../Healthyfood/assets/Images/Poster/Spouts.jpg'),
      price: 15,
      description: 'Light and healthy snacks for your quick hunger pangs.',
    },
    {
      id: 3,
      title: 'Nutritious Salad',
      image: require('../../Healthyfood/assets/Images/Poster/Spouts.jpg'),
      price: 20,
      description: 'A mix of sprouts, greens, and protein-rich toppings.',
    },
    {
      id: 4,
      title: 'Fresh Sprouts Bowl',
      image: require('../../Healthyfood/assets/Images/Poster/Spouts.jpg'),
      price: 18,
      description: 'Freshly prepared sprouts bowl for a healthy meal.',
    },
  ];

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        data={addposter}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('ProductDetail', {product: item})
            }>
            <Image source={item.image} style={styles.productImage} />
            <View style={styles.cardContent}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productDescription}>{item.description}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
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
    height: height * 0.32,
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
  },
});
