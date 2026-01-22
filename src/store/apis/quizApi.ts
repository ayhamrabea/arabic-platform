// في store/apis/quizApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


interface Quiz {
  id: string
  title: string
  description?: string
  lesson_id: string
  lesson_title?: string
  question_count: number
  time_limit?: number
  passing_score: number
  difficulty: 'easy' | 'medium' | 'hard'
  is_active: boolean
  tags?: string[]
  estimated_xp?: number
  created_at?: string
  attempts_count?: number
  average_score?: number
  max_attempts?: number
}



export const quizApi = createApi({
  reducerPath: 'quizApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Quiz', 'QuizQuestion', 'QuizAttempt', 'QuizResult', 'QuizStats'],

  endpoints: (builder) => ({
    // ===== QUIZZES =====
    getAllQuizzes: builder.query<Quiz[], void>({
      query: () => '/quizzes',
      providesTags: ['Quiz'],
    }),

    getLessonQuizzes: builder.query({
      query: (lessonId: string) => `/quizzes?lesson_id=${lessonId}`,
      providesTags: ['Quiz'],
    }),

    getQuizById: builder.query({
      query: (quizId: string) => `/quizzes/${quizId}`,
      providesTags: ['Quiz'],
    }),

    // ===== QUESTIONS =====
    getQuizQuestions: builder.query({
      query: (quizId: string) => `/quiz_questions?quiz_id=${quizId}`,
      providesTags: ['QuizQuestion'],
    }),

    // ===== ATTEMPTS =====
    startQuizAttempt: builder.mutation({
      query: ({ quizId, profileId }: { quizId: string; profileId: string }) => ({
        url: '/quiz-attempts/start',
        method: 'POST',
        body: { quizId, profileId },
      }),
      invalidatesTags: ['QuizAttempt', 'QuizStats'],
    }),

    submitQuizAnswer: builder.mutation({
      query: ({
        attemptId,
        questionId,
        selectedAnswer,
        timeSpent,
      }: {
        attemptId: string
        questionId: string
        selectedAnswer: string
        timeSpent: number
      }) => ({
        url: '/quiz-attempts/answer',
        method: 'POST',
        body: { attemptId, questionId, selectedAnswer, timeSpent },
      }),
    }),

    completeQuizAttempt: builder.mutation({
      query: ({ attemptId }: { attemptId: string }) => ({
        url: '/quiz-attempts/complete',
        method: 'POST',
        body: { attemptId },
      }),
      invalidatesTags: ['QuizAttempt', 'QuizResult', 'QuizStats'],
    }),

    // ===== RESULTS =====
    getQuizResult: builder.query({
      query: (attemptId: string) => `/quiz-attempts/${attemptId}/result`,
      providesTags: ['QuizResult'],
    }),

    // ===== USER ATTEMPTS =====
    getUserAttempts: builder.query({
      query: ({ profileId, quizId }: { profileId: string; quizId?: string }) => {
        console.log('API: getUserAttempts called with:', { profileId, quizId })
        const params = new URLSearchParams()
        params.append('profile_id', profileId)
        
        if (quizId) {
          params.append('quiz_id', quizId)
        }
        
        return `/quiz-attempts?${params.toString()}`
      },
      transformResponse: (response: any) => {
        console.log('API: getUserAttempts transformResponse:', response)
        return response || []
      },
      providesTags: ['QuizAttempt'],
    }),

    // ===== USER QUIZ STATS =====
    getUserQuizStats: builder.query({
      query: (profileId: string) => {
        console.log('API: getUserQuizStats for profileId:', profileId)
        const params = new URLSearchParams()
        params.append('profile_id', profileId)
        return `/quiz-attempts/stats?${params.toString()}`
      },
      transformResponse: (response: any) => {
        console.log('API: getUserQuizStats raw response:', response)
        
        if (response && typeof response === 'object') {
          return {
            totalAttempts: response.totalAttempts || 0,
            completedAttempts: response.completedAttempts || 0,
            passedAttempts: response.passedAttempts || 0,
            averageScore: response.averageScore || 0,
            passedQuizzes: response.passedQuizzes || [],
            attemptsByQuiz: response.attemptsByQuiz || {},
            quizStats: response.quizStats || {},
            success: response.success || false
          }
        }
        
        return {
          totalAttempts: 0,
          completedAttempts: 0,
          passedAttempts: 0,
          averageScore: 0,
          passedQuizzes: [],
          attemptsByQuiz: {},
          quizStats: {},
          success: false
        }
      },
      providesTags: ['QuizStats'],
    }),

    // ===== COMPLETED QUIZZES INFO =====
    getUserCompletedInfo: builder.query({
      query: (profileId: string) => {
        console.log('API: getUserCompletedInfo for profileId:', profileId)
        
        // هذا يستخدم endpoint الموجود بالفعل
        return {
          url: '/quiz-attempts',
          params: {
            profile_id: profileId,
            status: 'completed',
            _t: Date.now() // لمنع التخزين المؤقت
          }
        }
      },
      transformResponse: (response: any) => {
        console.log('API: getUserCompletedInfo response:', response)
        
        // حساب الإحصائيات من البيانات
        if (Array.isArray(response)) {
          const totalCompleted = response.length
          const passedQuizzes = new Set()
          const quizAttemptsMap: Record<string, any[]> = {}
          
          response.forEach(attempt => {
            // تجميع المحاولات حسب quiz_id
            if (attempt.quiz_id) {
              if (!quizAttemptsMap[attempt.quiz_id]) {
                quizAttemptsMap[attempt.quiz_id] = []
              }
              quizAttemptsMap[attempt.quiz_id].push(attempt)
            }
          })
          
          return {
            completedCount: totalCompleted,
            attemptsByQuiz: quizAttemptsMap,
            // جلب passedCount من endpoint منفصل أو نحسبه لاحقاً
          }
        }
        
        return {
          completedCount: 0,
          attemptsByQuiz: {},
        }
      },
      providesTags: ['QuizAttempt', 'QuizStats'],
    }),

  }),
})

export const {
  useGetAllQuizzesQuery,
  useGetLessonQuizzesQuery,
  useGetQuizByIdQuery,
  useGetQuizQuestionsQuery,
  useStartQuizAttemptMutation,
  useSubmitQuizAnswerMutation,
  useCompleteQuizAttemptMutation,
  useGetQuizResultQuery,
  useGetUserAttemptsQuery,
  useGetUserQuizStatsQuery,
  useGetUserCompletedInfoQuery,
} = quizApi