// app/api/quizzes/[id]/route.ts
import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

// GET: الحصول على اختبار محدد
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // استخراج الـ id من params
    const { id } = await params
    
    console.log('🔍 GET /api/quizzes/[id] - Quiz ID:', id)

    // التحقق من وجود ID
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      )
    }

    // جلب الاختبار من قاعدة البيانات
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        lesson:lessons(
          id,
          title,
          level
        ),
        questions:quiz_questions(
          id,
          question_text,
          question_type,
          order_index
        )
      `)
      .eq('id', id)
      .single()

    // التعامل مع الأخطاء
    if (error) {
      console.error('❌ Supabase error in /api/quizzes/[id]:', {
        message: error.message,
        code: error.code
      })
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Quiz not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch quiz',
          message: error.message,
          code: error.code
        },
        { status: 500 }
      )
    }

    console.log('✅ Quiz fetched successfully:', data.id)
    return NextResponse.json(data)
    
  } catch (error: any) {
    console.error('💥 Unexpected error in /api/quizzes/[id]:', {
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

// PUT: تحديث اختبار محدد
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    console.log('🔧 PUT /api/quizzes/[id] - Updating quiz:', id)

    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      )
    }

    // التحقق من وجود الاختبار أولاً
    const { data: existingQuiz, error: checkError } = await supabase
      .from('quizzes')
      .select('id')
      .eq('id', id)
      .single()

    if (checkError && checkError.code === 'PGRST116') {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // تحديث الاختبار
    const { data, error } = await supabase
      .from('quizzes')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating quiz:', error)
      return NextResponse.json(
        { error: 'Failed to update quiz', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Quiz updated successfully:', data.id)
    return NextResponse.json(data)
    
  } catch (error: any) {
    console.error('💥 Error in PUT /api/quizzes/[id]:', error)
    return NextResponse.json(
      { error: 'Invalid request data', details: error.message },
      { status: 400 }
    )
  }
}

// DELETE: حذف اختبار محدد
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('🗑️ DELETE /api/quizzes/[id] - Deleting quiz:', id)

    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      )
    }

    // حذف الاختبار
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Error deleting quiz:', error)
      return NextResponse.json(
        { error: 'Failed to delete quiz', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Quiz deleted successfully:', id)
    return NextResponse.json(
      { message: 'Quiz deleted successfully' },
      { status: 200 }
    )
    
  } catch (error: any) {
    console.error('💥 Error in DELETE /api/quizzes/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}