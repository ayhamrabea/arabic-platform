// app/api/quiz-attempts/complete/route.ts

import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { attemptId } = await req.json()

    if (!attemptId) {
      return NextResponse.json(
        { error: 'attemptId is required' },
        { status: 400 }
      )
    }

    // ======================================================
    // 1️⃣ جلب كل الإجابات للمحاولة
    // ======================================================
    const { data: answers, error: answersError } = await supabase
      .from('quiz_answers')
      .select('question_id, is_correct')
      .eq('attempt_id', attemptId)

    if (answersError) throw answersError

    // ======================================================
    // 2️⃣ حساب النتيجة
    // ======================================================
    let totalPoints = 0
    let earnedPoints = 0
    let correctAnswers = 0

    if (answers && answers.length > 0) {
      const questionIds = answers.map(a => a.question_id)

      const { data: questions, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('id, points')
        .in('id', questionIds)

      if (questionsError) throw questionsError

      answers.forEach(answer => {
        const question = questions?.find(q => q.id === answer.question_id)
        const points = question?.points ?? 10

        totalPoints += points

        if (answer.is_correct) {
          earnedPoints += points
          correctAnswers++
        }
      })
    }

    const finalScore =
      totalPoints > 0
        ? Math.round((earnedPoints / totalPoints) * 100)
        : 0

    // ======================================================
    // 3️⃣ تحديث محاولة الاختبار
    // ======================================================
    const { data: attempt, error: updateError } = await supabase
      .from('quiz_attempts')
      .update({
        status: 'completed',
        score: finalScore,
        correct_answers: correctAnswers,
        total_questions: answers?.length || 0,
        completed_at: new Date().toISOString()
      })
      .eq('id', attemptId)
      .select('id, quiz_id, profile_id, score')
      .single()

    if (updateError) throw updateError

    const profileId = attempt.profile_id

    // ======================================================
    // 4️⃣ جلب كل المحاولات المكتملة للمستخدم
    // ======================================================
    const { data: completedAttempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('id, score, quiz_id')
      .eq('profile_id', profileId)
      .eq('status', 'completed')

    if (attemptsError) throw attemptsError

    const completedCount = completedAttempts.length

    // ======================================================
    // 5️⃣ جلب passing_score لكل اختبار
    // ======================================================
    const quizIds = [...new Set(completedAttempts.map(a => a.quiz_id))]

    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('id, passing_score')
      .in('id', quizIds)

    if (quizzesError) throw quizzesError

    const passingScoreMap = new Map(
      quizzes.map(q => [q.id, q.passing_score])
    )

    // ======================================================
    // 6️⃣ حساب عدد المحاولات الناجحة
    // ======================================================
    const passedCount = completedAttempts.filter(attempt => {
      const passingScore = passingScoreMap.get(attempt.quiz_id)
      return (
        passingScore !== undefined &&
        attempt.score >= passingScore
      )
    }).length

    // ======================================================
    // 7️⃣ إعادة النتيجة
    // ======================================================
    return NextResponse.json({
      attempt,
      completedCount,
      passedCount
    })

  } catch (error: any) {
    console.error('Error completing quiz:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
