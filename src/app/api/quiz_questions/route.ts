// app/api/quiz_questions/route.ts
import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const quizId = searchParams.get('quiz_id')

  if (!quizId) {
    return NextResponse.json({ error: 'quiz_id is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('order_index')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
