// app/api/quiz-attempts/[attemptId]/result/route.ts

import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    // استخدام await للحصول على params
    const { attemptId } = await params

    console.log('Fetching result for attempt ID:', attemptId)

    if (!attemptId) {
      return NextResponse.json({ error: 'attemptId is required' }, { status: 400 })
    }

    // جلب محاولة الاختبار
    const { data: attempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('id', attemptId)
      .single()

    if (attemptError) {
      console.error('Error fetching attempt:', attemptError)
      if (attemptError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Quiz attempt not found' }, { status: 404 })
      }
      throw attemptError
    }

    // جلب إجابات هذا المحاولة
    const { data: answers, error: answersError } = await supabase
      .from('quiz_answers')
      .select('*')
      .eq('attempt_id', attemptId)

    if (answersError) {
      console.error('Error fetching answers:', answersError)
      throw answersError
    }

    // إرجاع النتيجة الأساسية إذا لم توجد إجابات
    if (!answers || answers.length === 0) {
      return NextResponse.json({
        ...attempt,
        score: attempt.score || 0,
        correct_answers: 0,
        total_questions: 0,
        answers: [],
        performance_summary: {
          percentage: attempt.score || 0,
          correct: 0,
          total: 0,
          average_time: 0
        }
      })
    }

    // جلب الأسئلة
    const questionIds = answers.map((a: any) => a.question_id)
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('id, question_text, correct_answer, explanation, points, difficulty')
      .in('id', questionIds)

    if (questionsError) {
      console.error('Error fetching questions:', questionsError)
      throw questionsError
    }

    // حساب الإحصائيات
    let totalScore = 0
    let totalPoints = 0
    const detailedAnswers = answers.map((answer: any) => {
      const question = questions?.find((q: any) => q.id === answer.question_id)
      const isCorrect = question?.correct_answer === answer.selected_answer
      const points = isCorrect ? (question?.points || 0) : 0
      
      totalScore += points
      totalPoints += question?.points || 0

      return {
        ...answer,
        question_text: question?.question_text,
        correct_answer: question?.correct_answer,
        explanation: question?.explanation,
        points: question?.points,
        difficulty: question?.difficulty,
        is_correct: isCorrect,
        earned_points: points
      }
    })

    // تحضير النتيجة النهائية
    const result = {
      ...attempt,
      score: totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : (attempt.score || 0),
      correct_answers: detailedAnswers.filter((a: any) => a.is_correct).length,
      total_questions: detailedAnswers.length,
      total_points: totalScore,
      max_points: totalPoints,
      answers: detailedAnswers,
      performance_summary: {
        percentage: totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : (attempt.score || 0),
        correct: detailedAnswers.filter((a: any) => a.is_correct).length,
        total: detailedAnswers.length,
        average_time: detailedAnswers.length > 0 
          ? Math.round(detailedAnswers.reduce((sum: number, a: any) => sum + (a.time_spent || 0), 0) / detailedAnswers.length)
          : 0
      }
    }

    console.log('Returning quiz result:', { attemptId, score: result.score })
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error in quiz result API:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      details: error.message
    }, { status: 500 })
  }
}