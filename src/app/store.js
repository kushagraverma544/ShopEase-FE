import { configureStore } from '@reduxjs/toolkit';

import cartReducer from '../features/cart/cartSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    cart: cartReducer,
  },
});
