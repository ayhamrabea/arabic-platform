// app/api/quizzes/route.ts
import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    // استخراج query parameters من URL
    const url = new URL(req.url)
    const lessonId = url.searchParams.get('lesson_id')
    
    console.log('🔍 GET /api/quizzes - lessonId:', lessonId)

    // إنشاء query أساسي
    let query = supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: true })

    // إضافة فلتر lesson_id إذا كان موجوداً
    if (lessonId && lessonId.trim() !== '' && lessonId !== 'undefined' && lessonId !== 'null') {
      query = query.eq('lesson_id', lessonId)
      console.log('📊 Filtering quizzes by lesson_id:', lessonId)
    }

    // تنفيذ query
    const { data, error } = await query

    // التعامل مع الأخطاء
    if (error) {
      console.error('❌ Supabase error in /api/quizzes:', {
        message: error.message,
        code: error.code,
        details: error.details
      })
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch quizzes',
          message: error.message,
          code: error.code
        },
        { status: 500 }
      )
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} quizzes`)
    
    // إرجاع النتائج
    return NextResponse.json(data || [])
    
  } catch (error: any) {
    console.error('💥 Unexpected error in /api/quizzes:', {
      message: error.message,
      stack: error.stack
    })
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

// POST endpoint لإنشاء اختبار جديد (اختياري)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    console.log('🔧 POST /api/quizzes - Creating new quiz:', body)

    const { data, error } = await supabase
      .from('quizzes')
      .insert([{
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating quiz:', error)
      return NextResponse.json(
        { error: 'Failed to create quiz', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Quiz created successfully:', data.id)
    return NextResponse.json(data, { status: 201 })
    
  } catch (error: any) {
    console.error('💥 Error in POST /api/quizzes:', error)
    return NextResponse.json(
      { error: 'Invalid request data', details: error.message },
      { status: 400 }
    )
  }
}