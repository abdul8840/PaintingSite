import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import artworkReducer from './slices/artworkSlice';
import categoryReducer from './slices/categorySlice';
import orderReducer from './slices/orderSlice';
import customOrderReducer from './slices/customOrderSlice';
import wishlistReducer from './slices/wishlistSlice';
import uiReducer from './slices/uiSlice';
import chatReducer from './slices/chatSlice';

const persistConfig = {
  key: 'sketchmint',
  storage,
  whitelist: ['cart', 'auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  artworks: artworkReducer,
  categories: categoryReducer,
  orders: orderReducer,
  customOrders: customOrderReducer,
  wishlist: wishlistReducer,
  ui: uiReducer,
  chat: chatReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);