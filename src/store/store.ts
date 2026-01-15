import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import authReducer from "./slices/authSlice";
import profileReducer from './../store/slices/profileSlice'
import dashboardReducer from './../store/slices/dashboardSlice'
import { lessonsApi } from "./apis/lessonsApi";
import { favoritesApi } from "./apis/favoritesApi";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    dashboard: dashboardReducer,
    [authApi.reducerPath]: authApi.reducer,
    [lessonsApi.reducerPath]: lessonsApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(authApi.middleware)
  .concat(lessonsApi.middleware)
  .concat(favoritesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
