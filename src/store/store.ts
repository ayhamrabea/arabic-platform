import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import authReducer from "./slices/authSlice";
import profileReducer from './../store/slices/profileSlice'
import dashboardReducer from './../store/slices/dashboardSlice'
import { lessonsApi } from "./apis/lessonsApi";
import { favoritesApi } from "./apis/favoritesApi";
import { lessonFavoritesApi } from "./apis/lessonsApi/lessonFavoritesApi";
import { quizApi } from "./apis/quizApi";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    dashboard: dashboardReducer,
    [authApi.reducerPath]: authApi.reducer,
    [lessonsApi.reducerPath]: lessonsApi.reducer,
    [lessonFavoritesApi.reducerPath]: lessonFavoritesApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(authApi.middleware)
  .concat(lessonsApi.middleware)
  .concat(lessonFavoritesApi.middleware) 
  .concat(favoritesApi.middleware)
  .concat(quizApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
