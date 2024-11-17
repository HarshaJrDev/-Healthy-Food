import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
};

const ProductSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = state.products.find(item => item.id === action.payload.id);
      if (product) {
        product.quantity += 1; 
      } else {
        state.products.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart(state, action) {
      const productIndex = state.products.findIndex(item => item.id === action.payload.id);
      if (productIndex !== -1) {
        const product = state.products[productIndex];
        if (product.quantity > 1) {
          product.quantity -= 1; 
        } else {
          state.products.splice(productIndex, 1);
        }
      }
    },
    increaseProduct(state, action) {
      const product = state.products.find(item => item.id === action.payload.id);
      if (product) {
        product.quantity += 1; 
      }
    },
    decreaseProduct(state, action) {
      const productIndex = state.products.findIndex(item => item.id === action.payload.id);
      if (productIndex !== -1) {
        const product = state.products[productIndex];
        if (product.quantity > 1) {
          product.quantity -= 1;
        } else {
          state.products.splice(productIndex, 1); 
        }
      }
    },
    clearCart(state) {
      state.products = []; 
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseProduct,
  decreaseProduct,
  clearCart,
} = ProductSlice.actions;

export default ProductSlice.reducer;
