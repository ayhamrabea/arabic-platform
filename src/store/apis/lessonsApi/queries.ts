import { supabase } from '@/lib/supabaseClient'
import { getCurrentUserId, getLessonTotalItems } from './helpers'
import type {
  LessonWithProgress,
  LessonDetailResponse,
  ProgressPercentage,
  LessonFilterParams
} from './types'

// استعلامات الدروس
export const lessonQueries = {
  // جلب الدروس مع التقدم
  getLessonsWithProgress: async (
    params?: LessonFilterParams
  ): Promise<LessonWithProgress[]> => {
    try {
      // 1. جلب الدروس الأساسية
      let query = supabase
        .from('lessons')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (params?.level && params.level !== 'all') {
        query = query.eq('level', params.level)
      }

      if (params?.type && params.type !== 'all') {
        query = query.eq('type', params.type)
      }

      const { data: lessons, error: lessonsError } = await query
      if (lessonsError) throw lessonsError
      if (!lessons?.length) return []

      // 2. جلب التقدم
      const lessonsWithProgress = await Promise.all(
        lessons.map(async (lesson) => {
          const [totalItems, vocabularyCount, grammarCount, progress] = 
            await Promise.all([
              getLessonTotalItems(lesson.id),
              supabase
                .from('vocabulary')
                .select('id', { count: 'exact', head: true })
                .eq('lesson_id', lesson.id)
                .then(res => res.count || 0),
              supabase
                .from('grammar_rules')
                .select('id', { count: 'exact', head: true })
                .eq('lesson_id', lesson.id)
                .then(res => res.count || 0),
              // جلب تقدم المستخدم
              (async () => {
                try {
                  const userId = await getCurrentUserId()
                  const { data } = await supabase
                    .from('student_progress')
                    .select('*')
                    .eq('lesson_id', lesson.id)
                    .eq('profile_id', userId)
                    .maybeSingle()
                  return data || undefined
                } catch {
                  return undefined
                }
              })()
            ])

          return {
            ...lesson,
            total_items: totalItems,
            vocabulary_count: vocabularyCount,
            grammar_count: grammarCount,
            progress
          }
        })
      )

      return lessonsWithProgress
    } catch (error) {
      console.error('Error in getLessonsWithProgress:', error)
      throw error
    }
  },

  // جلب درس مفصل
  getLessonById: async (lessonId: string): Promise<LessonDetailResponse> => {
    try {
      const userId = await getCurrentUserId()
      
      // جلب جميع البيانات في وقت واحد
      const [lessonRes, grammarRes, vocabRes, progressRes] = await Promise.all([
        supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .eq('is_active', true)
          .single(),
        supabase
          .from('grammar_rules')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('created_at'),
        supabase
          .from('vocabulary')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('created_at'),
        // جلب التقدم
        userId ? supabase
          .from('student_progress')
          .select('*')
          .eq('lesson_id', lessonId)
          .eq('profile_id', userId)
          .maybeSingle() : Promise.resolve({ data: null, error: null })
      ])

      if (lessonRes.error) throw lessonRes.error

      // جلب حالة المفضلة إذا كان المستخدم مسجل الدخول
      let favoriteWords: string[] = []
      let favoriteGrammar: string[] = []
      
      if (userId) {
        const [wordFavoritesRes, grammarFavoritesRes] = await Promise.all([
          supabase
            .from('favorites')
            .select('item_id')
            .eq('user_id', userId)
            .eq('item_type', 'word')
            .in('item_id', vocabRes.data?.map(v => v.id) || []),
          supabase
            .from('favorites')
            .select('item_id')
            .eq('user_id', userId)
            .eq('item_type', 'grammar')
            .in('item_id', grammarRes.data?.map(g => g.id) || [])
        ])

        if (wordFavoritesRes.data) {
          favoriteWords = wordFavoritesRes.data.map(f => f.item_id)
        }

        if (grammarFavoritesRes.data) {
          favoriteGrammar = grammarFavoritesRes.data.map(f => f.item_id)
        }
      }

      const total_items = (vocabRes.data?.length || 0) + (grammarRes.data?.length || 0)

      return {
        lesson: lessonRes.data,
        grammar: grammarRes.data || [],
        vocabulary: vocabRes.data || [],
        progress: progressRes.data,
        total_items,
        favorite_words: favoriteWords,
        favorite_grammar: favoriteGrammar
      }
    } catch (error) {
      console.error('Error in getLessonById:', error)
      throw error
    }
  },

  // حساب النسبة المئوية للتقدم
  getProgressPercentage: async (lessonId: string): Promise<ProgressPercentage> => {
    try {
      const [totalItems, progress] = await Promise.all([
        getLessonTotalItems(lessonId),
        (async () => {
          try {
            const userId = await getCurrentUserId()
            const { data } = await supabase
              .from('student_progress')
              .select('completed_items')
              .eq('lesson_id', lessonId)
              .eq('profile_id', userId)
              .maybeSingle()
            return data
          } catch {
            return null
          }
        })()
      ])

      const completed = progress?.completed_items?.length || 0
      const percentage = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0

      return {
        lessonId,
        percentage,
        completed,
        total: totalItems
      }
    } catch (error) {
      console.error('Error in getProgressPercentage:', error)
      throw error
    }
  }
}