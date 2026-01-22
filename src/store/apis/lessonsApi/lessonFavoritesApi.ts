// store/apis/lessonFavoritesApi.ts
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '@/lib/supabaseClient'
import { Lesson, StudentProgress } from './types'

export interface FavoriteLesson extends Lesson {
  is_favorite: true
  progress_status: StudentProgress['status']
}

export const lessonFavoritesApi = createApi({
  reducerPath: 'lessonFavoritesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['LessonFavorite'],
  endpoints: (builder) => ({
    /* ===== Get favorite lessons ===== */
    getFavoriteLessons: builder.query<FavoriteLesson[], void>({
  async queryFn() {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return { data: [] }

    const { data, error } = await supabase
      .from('student_progress')
      .select(`
        status,
        lessons (*)
      `)
      .eq('profile_id', user.id)
      .eq('is_favorite', true)

    if (error) return { error }

    const lessons: FavoriteLesson[] = (data ?? []).flatMap(row => {
      if (!row.lessons) return []

      // row.lessons هنا مصفوفة
      return row.lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        level: lesson.level,
        content: lesson.content,
        duration: lesson.duration,
        video_url: lesson.video_url,
        audio_url: lesson.audio_url,
        prerequisites: lesson.prerequisites,
        order_index: lesson.order_index,
        tags: lesson.tags,
        is_active: lesson.is_active,
        estimated_xp: lesson.estimated_xp,
        created_at: lesson.created_at,
        updated_at: lesson.updated_at,
        is_favorite: true,
        progress_status: row.status,
      }))
    })

    return { data: lessons }
  },
  providesTags: ['LessonFavorite'],
}),

    /* ===== Toggle lesson favorite ===== */
    toggleLessonFavorite: builder.mutation<
      boolean,
      { lessonId: string }  // فقط lessonId
    >({
      async queryFn({ lessonId }) {
        const user = (await supabase.auth.getUser()).data.user
        if (!user) throw new Error('Not authenticated')

        // جلب الوضع الحالي
        const { data: progressData, error: getError } = await supabase
          .from('student_progress')
          .select('is_favorite')
          .eq('profile_id', user.id)
          .eq('lesson_id', lessonId)
          .single()

        if (getError) throw getError

        const newFavorite = !(progressData?.is_favorite ?? false)

        const { error } = await supabase
          .from('student_progress')
          .upsert(
            {
              profile_id: user.id,
              lesson_id: lessonId,
              is_favorite: newFavorite,
            },
            { onConflict: 'profile_id,lesson_id' } // ✅ هنا صححت الاسم
          )

        if (error) throw error
        return { data: newFavorite }
      },
      invalidatesTags: ['LessonFavorite'],
    }),
  }),
})

export const {
  useGetFavoriteLessonsQuery,
  useToggleLessonFavoriteMutation,
} = lessonFavoritesApi
