import { supabase } from '@/lib/supabaseClient'
import { 
  getCurrentUserId, 
  getLessonTotalItems, 
  calculateProgressStatus,
} from './helpers'
import type { StudentProgress } from './types'
import { calculateXP, grantXP } from '@/utils/xp'
import { updateStreak } from '@/utils/services/streak'


// عمليات الطفرات
export const lessonMutations = {
  // تحديث العناصر المكتملة
  updateCompletedItems: async (
    lessonId: string,
    itemId: string,
    completed: boolean
  ): Promise<StudentProgress> => {
    try {
      const userId = await getCurrentUserId()
      const now = new Date().toISOString()

      // 1. جلب البيانات الحالية
      const { data: existing } = await supabase
        .from('student_progress')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('profile_id', userId)
        .maybeSingle()

      // 2. تحديث العناصر المكتملة
      const currentItems = existing?.completed_items || []
      let newItems: string[]

      if (completed) {
        newItems = currentItems.includes(itemId)
          ? currentItems
          : [...currentItems, itemId]
      } else {
        newItems = currentItems.filter((id: string) => id !== itemId) // إضافة النوع string هنا
      }

      // 3. حساب الحالة الجديدة
      const totalItems = await getLessonTotalItems(lessonId)
      const newStatus = calculateProgressStatus(newItems.length, totalItems)

      // 4. إعداد بيانات التحديث
      const upsertData: any = {
        profile_id: userId,
        lesson_id: lessonId,
        completed_items: newItems,
        status: newStatus,
        updated_at: now
      }

      if (existing) {
        // تحديث السجل الموجود
        upsertData.id = existing.id
        upsertData.started_at = existing.started_at
        upsertData.created_at = existing.created_at
        upsertData.attempts = existing.attempts || 1
        upsertData.is_favorite = existing.is_favorite
        upsertData.score = existing.score
        upsertData.notes = existing.notes
        upsertData.completed_at = newStatus === 'completed' && !existing.completed_at
          ? now
          : existing.completed_at
      } else {
        // إنشاء سجل جديد
        upsertData.started_at = now
        upsertData.created_at = now
        upsertData.attempts = 1
        upsertData.is_favorite = false
        upsertData.score = null
        upsertData.notes = null
        upsertData.completed_at = newStatus === 'completed' ? now : null
      }

      // 5. حفظ التحديثات
      const { data, error } = await supabase
        .from('student_progress')
        .upsert(upsertData)
        .select()
        .single()

      if (error) throw error

      // 6. تحديث XP إذا تم إكمال الدرس
      if (newStatus === 'completed' && (!existing || existing.status !== 'completed')) {
        const { data: lessonData } = await supabase
          .from('lessons')
          .select('estimated_xp')
          .eq('id', lessonId)
          .single()

        if (lessonData?.estimated_xp) {
          const xp = calculateXP({
            type: 'COMPLETE_LESSON',
            lessonXP: lessonData.estimated_xp
          })
          await grantXP(userId, xp, 'COMPLETE_LESSON')
        }
      }

      return data
    } catch (error) {
      console.error('Error in updateCompletedItems:', error)
      throw error
    }
  },

  // إكمال الدرس بالكامل
  completeLesson: async (lessonId: string): Promise<StudentProgress> => {
    try {
      const userId = await getCurrentUserId()
      const now = new Date().toISOString()

      // 1. جلب جميع عناصر الدرس
      const [vocabRes, grammarRes] = await Promise.all([
        supabase
          .from('vocabulary')
          .select('id')
          .eq('lesson_id', lessonId),
        supabase
          .from('grammar_rules')
          .select('id')
          .eq('lesson_id', lessonId),
        supabase
          .from('student_progress')
          .select('*')
          .eq('lesson_id', lessonId)
          .eq('profile_id', userId)
          .maybeSingle()
      ])

      const allItemIds = [
        ...(vocabRes.data?.map((v: any) => v.id) || []),
        ...(grammarRes.data?.map((g: any) => g.id) || [])
      ]

      // 2. إعداد بيانات التقدم
      const upsertData: any = {
        profile_id: userId,
        lesson_id: lessonId,
        status: 'completed',
        completed_items: allItemIds,
        completed_at: now,
        updated_at: now
      }

      // if (existingProgress) {
      //   upsertData.id = existingProgress.id
      //   upsertData.started_at = existingProgress.started_at
      //   upsertData.created_at = existingProgress.created_at
      //   upsertData.attempts = (existingProgress.attempts || 0) + 1
      //   upsertData.is_favorite = existingProgress.is_favorite
      //   upsertData.score = existingProgress.score
      //   upsertData.notes = existingProgress.notes
      // } else {
      //   upsertData.started_at = now
      //   upsertData.created_at = now
      //   upsertData.attempts = 1
      //   upsertData.is_favorite = false
      //   upsertData.score = null
      //   upsertData.notes = null
      // }

      // 3. حفظ التقدم
      const { data, error } = await supabase
        .from('student_progress')
        .upsert(upsertData)
        .select()
        .single()

      if (error) throw error

       // ✅ تحديث streak 
      await updateStreak(userId)  

      // 4. تحديث XP
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('estimated_xp')
        .eq('id', lessonId)
        .single()

      if (lessonData?.estimated_xp) {
        const xp = calculateXP({
          type: 'COMPLETE_LESSON',
          lessonXP: lessonData.estimated_xp
        })

        await grantXP(userId, xp, 'COMPLETE_LESSON')
      }

      return data
    } catch (error) {
      console.error('Error in completeLesson:', error)
      throw error
    }
  },

  // تبديل المفضلة
  toggleFavorite: async (
    lessonId: string,
    isFavorite: boolean
  ): Promise<StudentProgress> => {
    try {
      const userId = await getCurrentUserId()
      const now = new Date().toISOString()

      const { data: existing } = await supabase
        .from('student_progress')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('profile_id', userId)
        .maybeSingle()

      let upsertData: any

      if (existing) {
        upsertData = {
          ...existing,
          is_favorite: isFavorite,
          updated_at: now
        }
      } else {
        upsertData = {
          profile_id: userId,
          lesson_id: lessonId,
          is_favorite: isFavorite,
          status: 'pending',
          started_at: now,
          created_at: now,
          updated_at: now,
          attempts: 0,
          score: null,
          notes: null,
          completed_items: [],
          completed_at: null
        }
      }

      const { data, error } = await supabase
        .from('student_progress')
        .upsert(upsertData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error in toggleFavorite:', error)
      throw error
    }
  },

  // بدء الدرس
  startLesson: async (lessonId: string): Promise<StudentProgress> => {
    try {
      const userId = await getCurrentUserId()
      const now = new Date().toISOString()

      const { data: existing } = await supabase
        .from('student_progress')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('profile_id', userId)
        .maybeSingle()

      let upsertData: any

      if (existing) {
        // إذا كان الدرس مكتملاً، نعيده إلى قيد التقدم
        const newStatus = existing.status === 'completed' 
          ? 'in_progress' 
          : existing.status
        
        upsertData = {
          ...existing,
          status: newStatus,
          updated_at: now
        }
      } else {
        upsertData = {
          profile_id: userId,
          lesson_id: lessonId,
          status: 'in_progress',
          started_at: now,
          created_at: now,
          updated_at: now,
          attempts: 1,
          is_favorite: false,
          score: null,
          notes: null,
          completed_items: [],
          completed_at: null
        }
      }

      const { data, error } = await supabase
        .from('student_progress')
        .upsert(upsertData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error in startLesson:', error)
      throw error
    }
  }
}