import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // مهم
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
    },
    clearUser(state) {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
    },
    finishLoading(state) {
      state.loading = false
    },
  },
})

export const { setUser, clearUser, finishLoading } = authSlice.actions

export default authSlice.reducer;
