import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { lessonQueries } from './queries'
import { lessonMutations } from './mutations'
import type {
  LessonWithProgress,
  LessonDetailResponse,
  ProgressPercentage,
  LessonFilterParams,
  StudentProgress,
  Lesson,
  GrammarRule,
  Vocabulary
} from './types'

export const lessonsApi = createApi({
  reducerPath: 'lessonsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Lesson', 'Progress', 'Vocabulary', 'Grammar', 'LessonsList'],
  endpoints: (builder) => ({
    // =============== QUERIES ===============
    getLessonsWithProgress: builder.query<
      LessonWithProgress[],
      LessonFilterParams
    >({
      async queryFn(params = {}) {
        try {
          const data = await lessonQueries.getLessonsWithProgress(params)
          return { data }
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message
            }
          }
        }
      },
      providesTags: ['LessonsList']
    }),

    getLessonById: builder.query<LessonDetailResponse, string>({
      async queryFn(lessonId) {
        try {
          const data = await lessonQueries.getLessonById(lessonId)
          return { data }
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message
            }
          }
        }
      },
      providesTags: (result, error, lessonId) => [
        { type: 'Lesson', id: lessonId },
        { type: 'Progress', id: lessonId }
      ]
    }),

    getProgressPercentage: builder.query<ProgressPercentage, string>({
      async queryFn(lessonId) {
        try {
          const data = await lessonQueries.getProgressPercentage(lessonId)
          return { data }
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message
            }
          }
        }
      },
      providesTags: (result, error, lessonId) => [
        { type: 'Progress', id: lessonId }
      ]
    }),

    // =============== MUTATIONS ===============
    updateCompletedItems: builder.mutation<
      StudentProgress,
      { lessonId: string; itemId: string; completed: boolean }
    >({
      async queryFn({ lessonId, itemId, completed }) {
        try {
          const data = await lessonMutations.updateCompletedItems(
            lessonId,
            itemId,
            completed
          )
          return { data }
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message
            }
          }
        }
      },
      invalidatesTags: (result, error, { lessonId }) => [
        { type: 'Progress', id: lessonId },
        'LessonsList'
      ]
    }),

    completeLesson: builder.mutation<StudentProgress, { lessonId: string }>({
      async queryFn({ lessonId }) {
        try {
          const data = await lessonMutations.completeLesson(lessonId)
          return { data }
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message
            }
          }
        }
      },
      invalidatesTags: (result, error, { lessonId }) => [
        { type: 'Progress', id: lessonId },
        'LessonsList'
      ]
    }),

    toggleFavorite: builder.mutation<
      StudentProgress,
      { lessonId: string; isFavorite: boolean }
    >({
      async queryFn({ lessonId, isFavorite }) {
        try {
          const data = await lessonMutations.toggleFavorite(lessonId, isFavorite)
          return { data }
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message
            }
          }
        }
      },
      invalidatesTags: (result, error, { lessonId }) => [
        { type: 'Progress', id: lessonId }
      ]
    }),

    startLesson: builder.mutation<StudentProgress, { lessonId: string }>({
      async queryFn({ lessonId }) {
        try {
          const data = await lessonMutations.startLesson(lessonId)
          return { data }
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message
            }
          }
        }
      },
      invalidatesTags: (result, error, { lessonId }) => [
        { type: 'Progress', id: lessonId },
        'LessonsList'
      ]
    })
  })
})

// =============== Exports ===============
export const {
  useGetLessonsWithProgressQuery,
  useGetLessonByIdQuery,
  useGetProgressPercentageQuery,
  useUpdateCompletedItemsMutation,
  useCompleteLessonMutation,
  useToggleFavoriteMutation,
  useStartLessonMutation
} = lessonsApi

// تصدير الأنواع
export type {
  Lesson,
  GrammarRule,
  Vocabulary,
  StudentProgress,
  LessonWithProgress,
  LessonDetailResponse,
  ProgressPercentage,
  LessonFilterParams
}