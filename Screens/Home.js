import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  TextInput,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {createDrawerNavigator} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import Salad_Spouts from '../Components/Salad_Spouts';
import Salad_Egg from '../Components/Salad_Egg';
import Salad_Panner from '../Components/Salad_Panner';
import Tea_Detox from '../Components/Tea_Detox';
import Nuts_Laddu from '../Components/Nuts_Laddu';
const Drawer = createDrawerNavigator();
import Geolocation from '@react-native-community/geolocation';

const {width, height} = Dimensions.get('window');
const addposter = [
  {
    id: 1,
    title: 'Delicious Food',
    image: require('../../Healthyfood/assets/Images/Banner1.jpg'),
    price: 25,
  },
  {
    id: 2,
    title: 'Healthy Snacks',
    image: require('../../Healthyfood/assets/Images/Banner2.jpg'),
    price: 15,
  },
  {
    id: 3,
    title: 'Organic Bites',
    image: require('../../Healthyfood/assets/Images/Poster/Spouts.jpg'),
    price: 20,
  },
];

const App = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);

  const checkLocationService = () => {
    Geolocation.getCurrentPosition(
      () => {
        // Location services are available, continue
        requestLocationPermission();
      },
      err => {
        setError('Location services are not enabled');
      },
    );
  };
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getLocation();
    } else {
      // For Android, request location permission at runtime
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          setError('Location permission denied');
        }
      } catch (err) {
        setError('Error requesting location permission');
      }
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        setLocation(position.coords);
        await getReverseGeocode(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      err => setError('Error getting location: ' + err.message),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // Function to reverse geocode latitude and longitude to an address
  const getReverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'YourAppName', // Use your app name
            'Accept-Language': 'en', // Specify language for results
          },
        },
      );
      const data = await response.json();
      console.log('====================================');
      console.log(data.address);
      console.log('====================================');

      const placeName = data.address?.tourism;
      const road = data.address?.road;
      const state_district = data.address?.state_district;
      const state = data.address?.state;
      const postcode = data.address?.postcode;
      const formattedAddress = `${placeName}, ${road}, ${state},${state_district}, ${postcode}`;

      setAddress(formattedAddress);
    } catch (err) {
      setError('Error getting address: ' + err.message);
    }
  };

  // Request permission on mount
  useEffect(() => {
    checkLocationService(); // Ensure location service is enabled
  }, []);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  const navigation = useNavigation();
  const [isSelected, setIsSelected] = useState('1');
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <Text>Login</Text>
      </View>
    );
  }

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

  const SelectedComponent = MenuItems.find(
    item => item.id === isSelected,
  )?.Component;

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity >
            <Image
              resizeMode="contain"
              source={require('../../Healthyfood/assets/Images/Menu.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={{
                uri: user?.photoURL || 'https://via.placeholder.com/150',
              }}
              style={{width: 50, height: 50, borderRadius: 25}}
            />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <Text style={styles.greetingText}>
          {user.displayName?.toLowerCase().slice(0, 6)},
        </Text>

        {address && (
          <View style={styles.addressContainer}>
            <Ionicons
              style={{marginTop: height * 0.02}}
              name={'location'}
              size={20}
              color={'red'}
            />
            <Text numberOfLines={1} style={styles.locationText}>
              {address}
            </Text>
          </View>
        )}

        {/* Title */}
        <View style={styles.titleView}>
          <Text style={styles.title}>Delicious</Text>
          <Text style={styles.title}>food for you</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchView}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="#aaa"
            style={styles.input}
          />
          <AntDesign
            name="search1"
            size={height * 0.03}
            color="#aaa"
            style={styles.icon}
          />
        </View>

        <View>
          <FlatList
            data={addposter}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <View style={styles.posterContainer}>
                <Image  source={item.image} style={styles.posterImage} />
              </View>
            )}
          />
        </View>

        <View style={styles.container}>
          <FlatList
            data={MenuItems}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            renderItem={({item}) => (
              <View style={{padding: 10}}>
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
                    backgroundColor:
                      isSelected === item.id ? '#FA4A0C' : '#fff',
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
      </View>
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.07,
    paddingVertical: height * 0.02,
  },
  greetingText: {
    fontSize: height * 0.02,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: width * 0.05,
    bottom: height * 0.01,
    color: '#000',
  },
  titleView: {
    paddingHorizontal: width * 0.05,
    bottom:height*0.02
  },
  title: {
    fontSize: height * 0.04,
    fontWeight: 'bold',
    fontFamily: 'Poppins-ExtraBold',
    color: '#000',
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    backgroundColor: '#fff',
    width: width * 0.9,
    marginLeft: width * 0.05,

  },
  input: {
    flex: 1,
    fontSize: height * 0.02,
    paddingVertical: height * 0.01,
    color: '#000',
  },
  icon: {
    marginLeft: width * 0.02,
  },
  posterContainer: {
    marginHorizontal: width * 0.03,
    overflow: 'hidden',
    marginTop: height * 0.02,
  },
  posterImage: {
    width: width * 0.90,
    height: height * 0.2,
    borderRadius: 20,
  
  },
  addressContainer: {
    flexDirection: 'row',
    marginLeft: height * 0.02,
    alignItems: 'center',
    bottom: height * 0.02,
  },
  locationText: {
    fontSize: height * 0.02,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    color: '#000',
    marginTop: height * 0.02,
  },
});
