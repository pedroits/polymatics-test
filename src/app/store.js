import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../slices/product';

export const store = configureStore({
  reducer: {
    products: productsReducer
  },
});
