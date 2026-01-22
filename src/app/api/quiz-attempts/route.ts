// app/api/quiz-attempts/route.ts

import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const quizId = searchParams.get('quiz_id')
    const profileId = searchParams.get('profile_id')
    const status = searchParams.get('status')

    let query = supabase
      .from('quiz_attempts')
      .select('*')
      // استخدم started_at بدلاً من created_at
      .order('started_at', { ascending: false })

    if (quizId) {
      query = query.eq('quiz_id', quizId)
    }

    if (profileId) {
      query = query.eq('profile_id', profileId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error in quiz-attempts GET:', error)
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('API Error in quiz-attempts GET:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}

// يبدو أن لديك دالة POST مكررة في نفس الملف
// تأكد من أن لديك دالة POST واحدة فقط
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
    // 3️⃣ حساب رقم المحاولة
    // ======================================================
    const attemptNumber = completedAttempts.length + 1

    // ======================================================
    // 4️⃣ إنشاء محاولة جديدة
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