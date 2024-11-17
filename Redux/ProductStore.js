import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../Redux/ProductSlice'; 

const store = configureStore({
  reducer: {
    products: productReducer, 
  },
});

export default store;
