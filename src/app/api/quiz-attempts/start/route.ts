import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { quizId, profileId } = await req.json()

    if (!quizId || !profileId) {
      return NextResponse.json(
        { error: 'quizId and profileId are required' },
        { status: 400 }
      )
    }

    // ======================================================
    // 1️⃣ جلب passing_score للاختبار
    // ======================================================
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('id, passing_score')
      .eq('id', quizId)
      .single()

    if (quizError) throw quizError

    // ======================================================
    // 2️⃣ جلب المحاولات السابقة المكتملة
    // ======================================================
    const { data: completedAttempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('id, score')
      .eq('quiz_id', quizId)
      .eq('profile_id', profileId)
      .eq('status', 'completed')

    if (attemptsError) throw attemptsError

    // ======================================================
    // 3️⃣ التحقق هل المستخدم نجح سابقًا
    // ======================================================
    // const hasPassed = completedAttempts.some(
    //   attempt => attempt.score >= quiz.passing_score
    // )

    // if (hasPassed) {
    //   return NextResponse.json(
    //     { error: 'You already passed this quiz' },
    //     { status: 403 }
    //   )
    // }

    // ======================================================
    // 4️⃣ حساب رقم المحاولة
    // ======================================================
    const attemptNumber = completedAttempts.length + 1

    // ======================================================
    // 5️⃣ إنشاء محاولة جديدة
    // ======================================================
    const { data: attempt, error: insertError } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: quizId,
        profile_id: profileId,
        status: 'in_progress',
        attempt_number: attemptNumber,
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json(attempt)

  } catch (error: any) {
    console.error('Error starting quiz:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
