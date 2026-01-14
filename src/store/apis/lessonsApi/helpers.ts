import { supabase } from '@/lib/supabaseClient'

// مساعدات المصادقة
export const getCurrentUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  return user.id
}

// مساعدات حساب العناصر
export const getLessonTotalItems = async (lessonId: string): Promise<number> => {
  const [vocabRes, grammarRes] = await Promise.all([
    supabase
      .from('vocabulary')
      .select('id', { count: 'exact', head: true })
      .eq('lesson_id', lessonId),
    supabase
      .from('grammar_rules')
      .select('id', { count: 'exact', head: true })
      .eq('lesson_id', lessonId)
  ])

  return (vocabRes.count || 0) + (grammarRes.count || 0)
}

// مساعدات التقدم
export const calculateProgressStatus = (
  completedItems: number,
  totalItems: number
): 'pending' | 'in_progress' | 'completed' => {
  if (completedItems === 0) return 'pending'
  if (completedItems >= totalItems) return 'completed'
  return 'in_progress'
}

// مساعدات تحديث XP
export const updateUserXP = async (
  userId: string,
  xpAmount: number
): Promise<void> => {
  try {
    const { error: rpcError } = await supabase.rpc('increment_xp', {
      user_id: userId,
      xp_amount: xpAmount
    })

    if (rpcError) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_xp')
        .eq('id', userId)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({ 
            total_xp: (profile.total_xp || 0) + xpAmount,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
      }
    }
  } catch (error) {
    console.error('Error updating XP:', error)
    throw error
  }
}