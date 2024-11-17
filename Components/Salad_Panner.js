import { StyleSheet, Text, View, Dimensions, FlatList, Image } from 'react-native';
import React from 'react';

const { width, height } = Dimensions.get('window');

const Salad_Spouts = () => {
  const addposter = [
    {
      id: 1,
      title: 'Delicious Food',
      image: require('../../Healthyfood/assets/Images/Poster/Egg_Spouts.jpg'),
      price: 25,
    },
    {
      id: 2,
      title: 'Healthy Snacks',
      image: require('../../Healthyfood/assets/Images/Poster/Egg_Spouts.jpg'),
      price: 15,
    },
    {
      id: 3,
      title: 'Healthy Snacks',
      image: require('../../Healthyfood/assets/Images/Poster/Egg_Spouts.jpg'),
      price: 15,
    },
    {
      id: 4,
      title: 'Healthy Snacks',
      image: require('../../Healthyfood/assets/Images/Poster/Egg_Spouts.jpg'),
      price: 15,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', marginTop: height * 0.02 }}>
      <FlatList
        data={addposter}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} 
        
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <View style={styles.Productbgc}>
            <Image source={item.image} style={styles.productImage} />
            <Text style={styles.productTitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Salad_Spouts;

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  Productbgc: {
    height: height * 0.25,
    width: width * 0.45,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: width * 0.025, // Spacing between items
    borderRadius: height * 0.02,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Shadow for Android
  },
  productImage: {
    height: height * 0.15,
    width: width * 0.4,
    borderRadius: height * 0.01,
    marginBottom: height * 0.01,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});
