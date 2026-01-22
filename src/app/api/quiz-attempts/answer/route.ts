// app/api/quiz-attempts/answer/route.ts

import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { attemptId, questionId, selectedAnswer, timeSpent } = await req.json()

    if (!attemptId || !questionId || !selectedAnswer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // جلب الإجابة الصحيحة أولاً
    const { data: question, error: questionError } = await supabase
      .from('quiz_questions')
      .select('correct_answer, points')
      .eq('id', questionId)
      .single()

    if (questionError) throw questionError

    const isCorrect = question.correct_answer === selectedAnswer

    // تسجيل الإجابة
    const { data, error } = await supabase
      .from('quiz_answers')
      .upsert([{ 
        attempt_id: attemptId, 
        question_id: questionId, 
        selected_answer: selectedAnswer, 
        time_spent: timeSpent || 0,
        is_correct: isCorrect,
        answered_at: new Date().toISOString()
      }], {
        onConflict: 'attempt_id,question_id'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error submitting answer:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}