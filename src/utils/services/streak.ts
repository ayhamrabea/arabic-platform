import { supabase } from "@/lib/supabaseClient"

 // حساب الأيام المتتالية
export const updateStreak = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
        .from('profiles')
        .select('streak_days, last_active')
        .eq('id', userId)
        .single()
    
    if (error) throw error
    
    let newStreak = 1
    
    if (data.last_active) {
        const lastDate = new Date(data.last_active)
        const todayDate = new Date(today)
        const diffDays = Math.floor(
            (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        
        if (diffDays === 1) {
            // يوم متتالي
            newStreak = (data.streak_days || 0) + 1
        } else if (diffDays > 1) {
            // تخطى يوم أو أكثر - إعادة الضبط
            newStreak = 1
        } else if (diffDays === 0) {
            // نفس اليوم - الحفاظ على الـ Streak
            return { streak: data.streak_days || 0, isUpdated: false }
        }
    }
    
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            streak_days: newStreak,
            last_active: today,
        })
        .eq('id', userId)
    
    if (updateError) throw updateError
    
    return { streak: newStreak, isUpdated: true }
}