// app/api/quiz-attempts/stats/route.ts

import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const profileId = searchParams.get('profile_id')

    if (!profileId) {
      return NextResponse.json(
        { error: 'profile_id is required' },
        { status: 400 }
      )
    }

    console.log('Stats API: Fetching stats for profile:', profileId)

    // ======================================================
    // 1️⃣ جلب جميع محاولات المستخدم
    // ======================================================
    const { data: attempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select(`
        id,
        quiz_id,
        profile_id,
        attempt_number,
        score,
        correct_answers,
        total_questions,
        status,
        started_at,
        completed_at
      `)
      .eq('profile_id', profileId)

    if (attemptsError) {
      console.error('Stats API: Error fetching attempts:', attemptsError)
      throw attemptsError
    }

    console.log('Stats API: Found', attempts?.length || 0, 'attempts')

    // ======================================================
    // 2️⃣ جلب معلومات الاختبارات
    // ======================================================
    const quizIds = [...new Set(attempts?.map(a => a.quiz_id).filter(Boolean) || [])]
    let quizzes: any[] = []
    
    if (quizIds.length > 0) {
      console.log('Stats API: Fetching quizzes:', quizIds)
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select(`
          id,
          title,
          passing_score,
          difficulty,
          max_attempts,
          is_active,
          created_at
        `)
        .in('id', quizIds)

      if (quizzesError) {
        console.error('Stats API: Error fetching quizzes:', quizzesError)
      } else {
        quizzes = quizzesData || []
        console.log('Stats API: Found', quizzes.length, 'quizzes')
      }
    }

    // ======================================================
    // 3️⃣ حساب الإحصائيات الشاملة
    // ======================================================
    const totalAttempts = attempts?.length || 0
    const completedAttempts = attempts?.filter(a => a.status === 'completed').length || 0
    
    // حساب عدد المحاولات الناجحة
    let passedAttempts = 0
    const passedQuizzes = new Set()
    
    attempts?.forEach(attempt => {
      if (attempt.status === 'completed' && attempt.score !== null) {
        const quiz = quizzes.find(q => q.id === attempt.quiz_id)
        const passingScore = quiz?.passing_score || 70
        
        if (attempt.score >= passingScore) {
          passedAttempts++
          passedQuizzes.add(attempt.quiz_id)
        }
      }
    })

    // حساب متوسط النتيجة
    const completedScores = attempts
      ?.filter(a => a.status === 'completed' && a.score !== null)
      .map(a => a.score) || []

    const averageScore = completedScores.length > 0
      ? completedScores.reduce((sum, score) => sum + score, 0) / completedScores.length
      : 0

    // ======================================================
    // 4️⃣ تجميع المحاولات حسب الاختبار
    // ======================================================
    const attemptsByQuiz: Record<string, any[]> = {}
    const quizStats: Record<string, any> = {}

    attempts?.forEach(attempt => {
      const quizId = attempt.quiz_id
      
      // تجميع حسب الاختبار
      if (!attemptsByQuiz[quizId]) {
        attemptsByQuiz[quizId] = []
      }
      attemptsByQuiz[quizId].push(attempt)
      
      // تحديث إحصائيات الاختبار
      if (!quizStats[quizId]) {
        const quiz = quizzes.find(q => q.id === quizId)
        quizStats[quizId] = {
          attemptsCount: 0,
          bestScore: 0,
          lastAttempt: null,
          isPassed: false,
          passingScore: quiz?.passing_score || 70,
          maxAttempts: quiz?.max_attempts || 3,
          isActive: quiz?.is_active ?? true
        }
      }
      
      const stats = quizStats[quizId]
      stats.attemptsCount++
      
      // تحديث أفضل نتيجة
      if (attempt.score !== null && attempt.score > stats.bestScore) {
        stats.bestScore = attempt.score
      }
      
      // التحقق إذا نجح في هذا الاختبار
      if (attempt.status === 'completed' && attempt.score >= stats.passingScore) {
        stats.isPassed = true
      }
      
      // تحديث آخر محاولة (استخدم started_at أو completed_at)
      const attemptDate = attempt.completed_at || attempt.started_at
      if (attemptDate) {
        const attemptDateTime = new Date(attemptDate).getTime()
        const lastDateTime = stats.lastAttempt ? new Date(stats.lastAttempt).getTime() : 0
        
        if (!stats.lastAttempt || attemptDateTime > lastDateTime) {
          stats.lastAttempt = attemptDate
        }
      }
    })

    // ======================================================
    // 5️⃣ إرجاع النتائج
    // ======================================================
    const response = {
      totalAttempts,
      completedAttempts,
      passedAttempts,
      averageScore: Math.round(averageScore * 10) / 10,
      passedQuizzes: Array.from(passedQuizzes),
      attemptsByQuiz,
      quizStats,
      success: true,
      timestamp: new Date().toISOString()
    }

    console.log('Stats API: Returning response:', response)
    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Error in quiz stats API:', error)
    return NextResponse.json(
      { 
        error: error.message,
        success: false 
      },
      { status: 500 }
    )
  }
}