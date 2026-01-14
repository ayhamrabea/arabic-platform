// @/store/slices/dashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabaseClient";
import { CEFRLevel, getLevelByXP, getNextLevel } from "@/utils/levels";

export interface Lesson {
  id: string;
  title: string;
  type: string;
  level: CEFRLevel;
  duration: number;
  difficulty: string;
  estimated_xp: number;
  status?: string; // pending, in_progress, completed
  score?: number;
  started_at?: string;
  completed_at?: string;
}

export interface DashboardStats {
  totalLessons: number;
  completedLessons: number;
  totalXP: number;
  streakDays: number;
  timeSpent: number; //
  accuracy: number; // النسبة المئوية
  currentLevel: CEFRLevel;
  nextLevelXP: number;
  dailyGoal: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  recentLessons: Lesson[];
  recommendedLessons: Lesson[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  recentLessons: [],
  recommendedLessons: [],
  isLoading: true,
  error: null,
};



// جلب تقدم المستخدم من student_progress
const fetchUserProgress = async (userId: string) => {
  const { data: progressData, error } = await supabase
    .from('student_progress')
    .select(`
      *,
      lessons:lesson_id (
        id,
        title,
        type,
        level,
        duration,
        difficulty,
        estimated_xp
      )
    `)
    .eq('profile_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return progressData || [];
};

// جلب الدروس المقترحة بناءً على المستوى
const fetchRecommendedLessons = async (userLevel: string, completedLessonIds: string[]) => {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('level', userLevel) // أخذ الجزء الأول مثل 'A1'
    .eq('is_active', true)
    .not('id', 'in', `(${completedLessonIds.join(',') || '00000000-0000-0000-0000-000000000000'})`)
    .order('order_index', { ascending: true })
    .limit(3);

  if (error) throw error;
  return lessons || [];
};

// Async thunk
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (userId: string, { rejectWithValue }) => {
    try {
      // جلب بيانات البروفايل
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('total_xp, streak_days , time_spent')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // جلب تقدم المستخدم
      const progressData = await fetchUserProgress(userId);

      // حساب الإحصائيات
      const completedLessons = progressData.filter(p => p.status === 'completed');
      const totalTimeSpent = profileData.time_spent || 0


      const averageScore = completedLessons.length > 0 
        ? Math.round(completedLessons.reduce((acc, p) => acc + (p.score || 0), 0) / completedLessons.length)
        : 0;

      // const { level: currentLevel, nextXP } = getLevelByXP(profileData.total_xp);
      const currentLevel = getLevelByXP(profileData.total_xp);
      const nextLevel = getNextLevel(profileData.total_xp);
      
      // جلب الدروس المقترحة
      const completedLessonIds = completedLessons.map(p => p.lesson_id);
      const recommendedLessons = await fetchRecommendedLessons(currentLevel.key, completedLessonIds);

      const stats: DashboardStats = {
        totalLessons: progressData.length,
        completedLessons: completedLessons.length,
        totalXP: profileData.total_xp || 0,
        streakDays: profileData.streak_days || 0,
        accuracy: averageScore,
        currentLevel: currentLevel.key,
        nextLevelXP: nextLevel?.minXP ?? currentLevel.maxXP,
        timeSpent: totalTimeSpent,
        dailyGoal: 30, // دقيقة يومياً
      };

      // تحويل progressData إلى Lessons
      const recentLessons: Lesson[] = progressData.slice(0, 5).map(p => ({
        id: p.lesson_id,
        title: (p.lessons as any)?.title || 'Unknown Lesson',
        type: (p.lessons as any)?.type || 'lesson',
        level: (p.lessons as any)?.level || 'A1',
        duration: (p.lessons as any)?.duration || 0,
        difficulty: (p.lessons as any)?.difficulty || 'medium',
        estimated_xp: (p.lessons as any)?.estimated_xp || 0,
        status: p.status,
        score: p.score,
        started_at: p.started_at,
        completed_at: p.completed_at
      }));

      return {
        stats,
        recentLessons,
        recommendedLessons
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// بدء درس جديد
export const startLesson = createAsyncThunk(
  'dashboard/startLesson',
  async ({ userId, lessonId }: { userId: string; lessonId: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .upsert({
          profile_id: userId,
          lesson_id: lessonId,
          status: 'in_progress',
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// حساب الوقت
export const updateTimeSpent = createAsyncThunk(
  'dashboard/updateTimeSpent',
  async (
    { userId, minutes }: { userId: string; minutes: number },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('time_spent')
        .eq('id', userId)
        .single()

      if (error) throw error

      const newTime = (data.time_spent || 0) + minutes

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ time_spent: newTime })
        .eq('id', userId)

      if (updateError) throw updateError

      return minutes
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)



// إكمال درس
// export const completeLesson = createAsyncThunk(
//   'dashboard/completeLesson',
//   async ({ 
//     userId, 
//     lessonId, 
//     score,
//     xpEarned 
//   }: { 
//     userId: string; 
//     lessonId: string; 
//     score: number;
//     xpEarned: number;
//   }, { rejectWithValue }) => {
//     try {
//       // تحديث تقدم الطالب
//       const { data: progressData, error: progressError } = await supabase
//         .from('student_progress')
//         .update({
//           status: 'completed',
//           score,
//           completed_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         })
//         .eq('profile_id', userId)
//         .eq('lesson_id', lessonId)
//         .select()
//         .single();

//       if (progressError) throw progressError;

//       // تحديث الـ XP في البروفايل
//       const { error: profileError } = await supabase
//         .from('profiles')
//         .update({
//           total_xp: supabase.rpc('increment', { x: xpEarned })
//         })
//         .eq('id', userId);

//       if (profileError) throw profileError;

//       return { progress: progressData, xpEarned };
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateStats(state, action: PayloadAction<Partial<DashboardStats>>) {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },
    addRecentLesson(state, action: PayloadAction<Lesson>) {
      state.recentLessons = [action.payload, ...state.recentLessons].slice(0, 5);
    },
    clearDashboard(state) {
      state.stats = null;
      state.recentLessons = [];
      state.recommendedLessons = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.recentLessons = action.payload.recentLessons;
        state.recommendedLessons = action.payload.recommendedLessons;
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Start Lesson
      .addCase(startLesson.fulfilled, (state, action) => {
        const lesson = action.payload.lessons as any;
        if (lesson) {
          const newLesson: Lesson = {
            id: action.payload.lesson_id,
            title: lesson.title || 'New Lesson',
            type: lesson.type || 'lesson',
            level: lesson.level || 'A1',
            duration: lesson.duration || 0,
            difficulty: lesson.difficulty || 'medium',
            estimated_xp: lesson.estimated_xp || 0,
            status: 'in_progress',
            started_at: action.payload.started_at
          };
          state.recentLessons = [newLesson, ...state.recentLessons].slice(0, 5);
        }
      })
      .addCase(updateTimeSpent.fulfilled, (state, action) => {
        if (state.stats) {
          state.stats.timeSpent += action.payload
        }
      })

    // // Complete Lesson
      // .addCase(completeLesson.fulfilled, (state, action) => {
      //   // تحديث الـ stats
      //   if (state.stats) {
      //     state.stats.totalXP += action.payload.xpEarned;
      //     state.stats.completedLessons += 1;
          
      //     // حساب المستوى الجديد
      //     const level = getLevelByXP(state.stats.totalXP);
      //     const nextLevel = getNextLevel(state.stats.totalXP);

      //     state.stats.currentLevel = level.key;
      //     state.stats.nextLevelXP = nextLevel?.minXP ?? level.maxXP;
      //   }
        
      //   // تحديث الدرس في recentLessons
      //   const lessonIndex = state.recentLessons.findIndex(
      //     lesson => lesson.id === action.payload.progress.lesson_id
      //   );
      //   if (lessonIndex !== -1) {
      //     state.recentLessons[lessonIndex].status = 'completed';
      //     state.recentLessons[lessonIndex].score = action.payload.progress.score;
      //     state.recentLessons[lessonIndex].completed_at = action.payload.progress.completed_at;
      //   }
      // });
  },
});

export const { updateStats, addRecentLesson, clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;