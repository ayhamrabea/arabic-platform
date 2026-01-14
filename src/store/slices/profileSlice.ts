import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabaseClient";
import { calculateStreak } from "@/utlis/profile";

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  total_xp: number;
  streak_days: number;
  country?: string;
  birth_date?: string;
  created_at: string;
  updated_at: string;
  last_active: string;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
}

const initialState: ProfileState = {
  profile: null,
  loading: true,
  error: null,
  isEditing: false,
};

// Async thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        const newProfile = {
          id: userId,
          name: '',
          email: '',
          avatar_url: '/default-avatar.png',
          total_xp: 0,
          streak_days: 0,
          last_active: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        return createdProfile;
      }

      if (error) throw error;

      // حساب streak جديد
      const newStreak = calculateStreak(profileData.last_active, profileData.streak_days);

      // تحديث last_active و streak_days في DB
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          last_active: new Date().toISOString(),
          streak_days: newStreak,
        })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      return updatedProfile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ 
    id, 
    updates 
  }: { 
    id: string; 
    updates: Partial<Profile> 
  }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile | null>) {
      state.profile = action.payload;
    },
    setEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    },
    updateLocalProfile(state, action: PayloadAction<Partial<Profile>>) {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    clearProfile(state) {
      state.profile = null;
      state.loading = false;
      state.error = null;
      state.isEditing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.isEditing = false;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setProfile, setEditing, updateLocalProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;