import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';

import Salad_Spouts from '../Components/Salad_Spouts';
import Salad_Egg from '../Components/Salad_Egg';
import Salad_Panner from '../Components/Salad_Panner';
import Tea_Detox from '../Components/Tea_Detox';
import Nuts_Laddu from '../Components/Nuts_Laddu';

const { width, height } = Dimensions.get('window');








const Menutitle = () => {
  const [isSelected, setIsSelected] = useState('1');

  const MenuItems = [
    {
      id: '1',
      Dish: 'Salad Spouts',
      Component: Salad_Spouts,
    },
    {
      id: '2',
      Dish: 'Salad Egg',
      Component: Salad_Egg,
    },
    {
      id: '3',
      Dish: 'Salad Panner',
      Component: Salad_Panner,
    },
    {
      id: '4',
      Dish: 'Tea Detox',
      Component: Tea_Detox,
    },
    {
      id: '5',
      Dish: 'Nuts Laddu',
      Component: Nuts_Laddu,
    },
  ];

  const handlePress = id => {
    if (isSelected !== id) {
      setIsSelected(id);
    }
  };

  const SelectedComponent = MenuItems.find(item => item.id === isSelected)?.Component;

  return (
    <View style={styles.Menutitlestyle}>
      <FlatList
        data={MenuItems}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text
              onPress={() => handlePress(item.id)}
              style={{
                color: isSelected === item.id ? '#FA4A0C' : '#000',
                fontFamily: 'Poppins-Regular',
                width: width * 0.3,
              }}>
              {item.Dish}
            </Text>
            <View
              style={{
                backgroundColor: isSelected === item.id ? '#FA4A0C' : '#fff',
                height: height * 0.002,
                marginTop: height * 0.01,
                marginBottom: height * 0.01,
                width: width * 0.2,
              }}></View>
          </View>
        )}
      />

      {SelectedComponent && <SelectedComponent />}
    </View>
  );
};

export default Menutitle;

const styles = StyleSheet.create({
  Menutitlestyle: {
    height: '50%',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});