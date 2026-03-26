import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import artworkReducer from './slices/artworkSlice';
import categoryReducer from './slices/categorySlice';
import orderReducer from './slices/orderSlice';
import customOrderReducer from './slices/customOrderSlice';
import couponReducer from './slices/couponSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

const persistConfig = {
  key: 'sketchmint-admin',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  artworks: artworkReducer,
  categories: categoryReducer,
  orders: orderReducer,
  customOrders: customOrderReducer,
  coupons: couponReducer,
  users: userReducer,
  ui: uiReducer,
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