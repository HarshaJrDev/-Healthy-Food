import { FlatList, Image, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import AntDesign from 'react-native-vector-icons/AntDesign';
const { width, height } = Dimensions.get('window'); // Get screen width and height for responsive design

const OnBoard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null); // Reference for FlatList
  const navigation = useNavigation(); // Hook for navigation

  const Sliders = [
    {
      id: 1,
      title: 'Seasonal Fruits',
      image: require('../../Healthyfood/assets/Images/Poster/Spouts.jpg'),
      description: 'A refreshing mix of seasonal fruits packed with vitamins.',
    },
    {
      id: 2,
      title: 'Organic Vegetables',
      image: require('../../Healthyfood/assets/Images/Poster/Spouts.jpg'),
      description: 'A healthy assortment of organic vegetables, rich in fiber and nutrients.',
    },
    {
      id: 3,
      title: 'Protein-packed Meals',
      image: require('../../Healthyfood/assets/Images/Poster/Sugarfree_Dates_Nuts_Ladoo_(1)-transformed.jpeg'),
      description: 'Protein-packed meals to fuel your workout and recovery.',
    },
  ];

  // Use useRef to avoid redefining the function on every render
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  // Function to go to the next slider
  const goToNextSlider = () => {
    if (currentIndex < Sliders.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex });
    } else {
      // Navigate to SignIn screen when reaching the last slider
      navigation.navigate('Signin');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <FlatList
          ref={flatListRef} // Attach the ref to FlatList
          data={Sliders}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatlistContent}
          renderItem={({ item }) => (
            <View style={styles.sliderItem}>
              {/* Title above image */}
              <Image source={item.image} style={styles.sliderImage} />

              {/* Pagination dots */}
              <View style={styles.paginationContainer}>
                {Sliders.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      {
                        backgroundColor: index === currentIndex ? '#FA4A0C' : '#D5DEE7',
                      },
                    ]}
                  />
                ))}
              </View>

              {/* Description Text */}
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          )}
          onViewableItemsChanged={onViewableItemsChanged.current} // Use ref to avoid dynamic change
          viewabilityConfig={viewabilityConfig.current} // Avoid changing it on the fly
        />
      </View>

      <TouchableOpacity style={styles.NextBtn} onPress={goToNextSlider}>
        <Text style={{ textAlign: "center" ,right:-height*0.02,fontFamily:"Poppins-Regular"}}>Next</Text>
        <AntDesign style={{left:-height*0.02,justifyContent:"center"}} name={"right"} size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sliderContainer: {
    marginTop: height * 0.05, // 5% of the screen height
    marginBottom: height * 0.03, // 3% of the screen height
    marginHorizontal: width * 0.03, // 5% of the screen width
  },
  flatlistContent: {
    justifyContent: 'center',
    columnGap: width * 0.04, // 5% gap between items
  },
  sliderItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.9, // Adjust width for better centering
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.03, // 3% of the screen height for font size
    color: '#333',
    textAlign: 'left',
    marginBottom: height * 0.02, 
    // 2% margin bottom for spacing
  },
  sliderImage: {
    height: height * 0.4, // 40% of screen height
    width: '100%', // Make image responsive
    borderRadius: 20,
    resizeMode: 'cover',
  },
  descriptionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: height * 0.02, // 2% of the screen height for font size
    color: '#333',
    textAlign: 'center',
    marginTop: height * 0.02, // 2% margin top
    paddingHorizontal: width * 0.05, // 5% padding on left and right
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.02, // 2% of the screen height
  },
  paginationDot: {
    height: height * 0.01, // 1% of the screen height
    width: width * 0.02, // 2% of the screen width
    borderRadius: height * 0.005, // Half of the height to make it circular
    marginHorizontal: width * 0.02, // 2% of the screen width for spacing between dots
    marginBottom: height * 0.02, // 2% of the screen height
  },
  NextBtn: {
    marginHorizontal: height * 0.02,
    height: height * 0.05,
    justifyContent: "space-between",
    top: height * 0.15,
    backgroundColor: '#FA4A0a',
    borderRadius: height * 0.2,
    flexDirection:"row",
alignItems:"center"

  }
});

export default OnBoard;
