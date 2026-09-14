import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import { loadPersistedAuth, persistAuth } from '../features/auth/authStorage';
import cartReducer from '../features/cart/cartSlice';
import uiReducer from '../features/ui/uiSlice';

const persistedAuth = loadPersistedAuth();

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    cart: cartReducer,
    auth: authReducer,
  },
  preloadedState: persistedAuth ? { auth: persistedAuth } : undefined,
});

let previousAuthState = store.getState().auth;
store.subscribe(() => {
  const authState = store.getState().auth;
  if (authState !== previousAuthState) {
    previousAuthState = authState;
    persistAuth(authState);
  }
});
