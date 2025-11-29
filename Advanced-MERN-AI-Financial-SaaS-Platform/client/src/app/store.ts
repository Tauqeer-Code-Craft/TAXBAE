import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { apiClient } from "./api-client"; // Assuming this is the general API client for other APIs
import { chatApi } from "../services/chatApi"; // Import chat API slice

type RootReducerType = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: "root",
  storage,
  blacklist: [apiClient.reducerPath, chatApi.reducerPath], // Optionally persist API data if needed
};

const rootReducer = combineReducers({
  [apiClient.reducerPath]: apiClient.reducer, // Add API client reducer
  [chatApi.reducerPath]: chatApi.reducer, // Add chatApi reducer for Gemini chat
  auth: authReducer,
});

// Create a persisted version of the root reducer
const persistedReducer = persistReducer<RootReducerType>(persistConfig, rootReducer);

const reduxPersistActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: reduxPersistActions, // Ignore serializable checks for specific actions
      },
    }).concat(apiClient.middleware, chatApi.middleware), // Add middleware for chatApi
});

export const persistor = persistStore(store); // Create a persistor linked to the store

export type RootState = ReturnType<typeof store.getState>;
