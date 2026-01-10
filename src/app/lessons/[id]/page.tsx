'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { BackButton } from '@/components/ui/BackButton'
import { MediaPlayer } from '@/components/media/MediaPlayer'
import { VocabularyCard } from '@/components/vocabulary/VocabularyCard'
import { GrammarCard } from '@/components/grammar/GrammarCard'
import { 
  ClockIcon,
  StarIcon,
  FireIcon,
  BookmarkIcon,
  AcademicCapIcon,
  LockClosedIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

// Interfaces مطابقة للجدول تماماً
interface Lesson {
  id: string
  title: string
  type: string
  level: string
  content: any
  duration: number | null
  video_url: string | null
  audio_url: string | null
  difficulty: string
  prerequisites: any[]
  order_index: number
  tags: string[]
  is_active: boolean
  estimated_xp: number
  created_at: string
  updated_at: string
}

interface GrammarRule {
  id: string
  rule_name: string
  examples: any
  exceptions: string
  explanation: string
  created_at: string
  updated_at: string
}

interface Vocabulary {
  id: string
  word: string
  translation: string
  pronunciation: string
  example_sentence: string
  audio_url: string | null
  word_type: string
  difficulty_score: number
  created_at: string
  updated_at: string
}

interface Quiz {
  id: string
  title: string
  description: string | null
  question_count: number
  passing_score: number
  time_limit: number | null
  max_attempts: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface StudentProgress {
  id: string
  status: string
  score: number | null
  attempts: number
  is_favorite: boolean
  notes: string | null
  started_at: string
  completed_at: string | null
  completed_items: string[]
}

export default function LessonDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [grammar, setGrammar] = useState<GrammarRule[]>([])
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [completedItems, setCompletedItems] = useState<string[]>([])


  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
      return user?.id
    }

    const fetchLessonData = async () => {
      setLoading(true)
      
      try {
        const user = await getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // جلب الدرس
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single()

        if (lessonError) throw lessonError
        if (!lessonData) throw new Error('Lesson not found or inactive')

        setLesson(lessonData)

        // جلب البيانات المرتبطة بالتوازي
        const [
          { data: grammarData },
          { data: vocabData },
          { data: quizzesData },
          { data: progressData }
        ] = await Promise.all([
          supabase.from('grammar_rules').select('*').eq('lesson_id', id),
          supabase.from('vocabulary').select('*').eq('lesson_id', id),
          supabase.from('quizzes').select('*').eq('lesson_id', id).eq('is_active', true),
          supabase.from('student_progress')
            .select('*')
            .eq('lesson_id', id)
            .eq('profile_id', user)
            .single()
        ])

        setGrammar(grammarData || [])
        setVocabulary(vocabData || [])
        setQuizzes(quizzesData || [])
        setProgress(progressData)
        setCompletedItems(progressData?.completed_items || [])


      } catch (err: any) {
        setError(err.message)
      }

      setLoading(false)
    }

    fetchLessonData()
  }, [id, router])

  const handleMarkFavorite = async () => {
    if (!lesson || !userId) return

    const newFavorite = !progress?.is_favorite
    const completedItems = progress?.completed_items || []
    
    const { error } = await supabase
      .from('student_progress')
      .upsert({
        profile_id: userId,
        lesson_id: lesson.id,
        is_favorite: newFavorite,
        status: progress?.status || 'pending',
        completed_items: completedItems
      })

    if (!error) {
      setProgress(prev => prev ? { 
        ...prev, 
        is_favorite: newFavorite 
      } : {
        id: '',
        status: 'pending',
        score: null,
        attempts: 0,
        is_favorite: newFavorite,
        notes: null,
        started_at: new Date().toISOString(),
        completed_at: null,
        completed_items: []
      })
    }
  }

  const toggleComplete = async (itemId: string) => {
    if (!userId || !lesson) return

    setCompletedItems(prev => {
      const newItems = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]

      const totalItems = vocabulary.length + grammar.length
      const newStatus =
        newItems.length === 0
          ? 'pending'
          : newItems.length >= totalItems
          ? 'completed'
          : 'in_progress'

      // ⬇️ تحديث Supabase (fire & forget أو await)
      supabase.from('student_progress').upsert({
        profile_id: userId,
        lesson_id: lesson.id,
        status: newStatus,
        completed_items: newItems,
        is_favorite: progress?.is_favorite ?? false,
        completed_at: newStatus === 'completed'
          ? new Date().toISOString()
          : null
      })

      return newItems
    })
  }

  const handleCompleteLesson = async () => {
    if (!userId || !lesson) return

    const allItemIds = [
      ...vocabulary.map(v => v.id),
      ...grammar.map(g => g.id)
    ]

    const { error } = await supabase
      .from('student_progress')
      .upsert({
        profile_id: userId,
        lesson_id: lesson.id,
        status: 'completed',
        completed_items: allItemIds,
        is_favorite: progress?.is_favorite || false,
        completed_at: new Date().toISOString()
      })

    if (!error) {
      // تحديث XP للمستخدم
      await supabase.rpc('increment_xp', { 
        user_id: userId, 
        xp_amount: lesson.estimated_xp 
      })

      setProgress(prev => prev ? { 
        ...prev, 
        status: 'completed',
        completed_items: allItemIds,
        completed_at: new Date().toISOString()
      } : {
        id: '',
        status: 'completed',
        score: null,
        attempts: 0,
        is_favorite: false,
        notes: null,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        completed_items: allItemIds
      })
    }
  }

  const handleStartQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}?lesson=${lesson?.id}`)
  }

  if (loading) return <LoadingSpinner />
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <BackButton href="/lessons" />
        <ErrorMessage message={error} />
      </div>
    </div>
  )

  if (!lesson) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <BackButton href="/lessons" />
        <ErrorMessage message="Lesson not found" />
      </div>
    </div>
  )

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'A1': 'bg-green-100 text-green-800',
      'A2': 'bg-blue-100 text-blue-800',
      'B1': 'bg-yellow-100 text-yellow-800',
      'B2': 'bg-orange-100 text-orange-800',
      'C1': 'bg-red-100 text-red-800',
      'C2': 'bg-purple-100 text-purple-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'easy': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'hard': 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800'
  }

  const renderContent = () => {
    if (!lesson.content) return null

    if (typeof lesson.content === 'string') {
      return <div className="text-gray-700 leading-relaxed whitespace-pre-line">{lesson.content}</div>
    }

    if (lesson.content.text) {
      return (
        <div className="space-y-4">
          <div className="text-gray-700 leading-relaxed">{lesson.content.text}</div>
          
          {lesson.content.images && lesson.content.images.map((img: string, idx: number) => (
            <img key={idx} src={img} alt="" className="rounded-lg max-w-full" />
          ))}
          
          {lesson.content.videos && lesson.content.videos.map((video: string, idx: number) => (
            <div key={idx} className="mt-4">
              <video src={video} controls className="rounded-lg w-full" />
            </div>
          ))}
        </div>
      )
    }

    return (
      <pre className="text-gray-700 whitespace-pre-wrap text-sm">
        {JSON.stringify(lesson.content, null, 2)}
      </pre>
    )
  }

  const totalItems = vocabulary.length + grammar.length
  const progressPercentage =
    totalItems > 0 ? Math.round((completedItems.length / totalItems) * 100) : 0


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <BackButton href="/lessons" />
        </div>

        {/* Lesson Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(lesson.level)}`}>
                  {lesson.level}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty}
                </span>
                {lesson.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{lesson.duration || 15} min</span>
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 mr-2" />
                  <span>Lesson #{lesson.order_index}</span>
                </div>
                <button
                  onClick={handleMarkFavorite}
                  className={`flex items-center ${progress?.is_favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                >
                  <BookmarkIcon className="h-5 w-5 mr-1" />
                  {progress?.is_favorite ? 'Saved' : 'Save'}
                </button>
              </div>

              {/* Progress Status */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold capitalize">{progress?.status || 'pending'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{completedItems.length} of {totalItems} items</span>
                  <span>{progressPercentage}%</span>
                </div>
              </div>
            </div>

            {/* XP Badge */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
              <div className="flex items-center">
                <FireIcon className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Complete to earn</div>
                  <div className="text-2xl font-bold text-gray-900">{lesson.estimated_xp} XP</div>
                  {progress?.status === 'completed' && (
                    <div className="flex items-center text-green-600 text-sm mt-1">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      <span>Completed!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Media & Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video/Audio */}
            {lesson.video_url && (
              <MediaPlayer 
                type="video"
                url={lesson.video_url}
                title={lesson.title}
              />
            )}

            {lesson.audio_url && (
              <MediaPlayer 
                type="audio"
                url={lesson.audio_url}
                title={lesson.title}
              />
            )}

            {/* Lesson Content */}
            {lesson.content && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Lesson Content</h2>
                {renderContent()}
              </div>
            )}

            {/* Quizzes */}
            {quizzes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Quizzes</h2>
                <div className="space-y-4">
                  {quizzes.map(quiz => (
                    <div key={quiz.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{quiz.title}</h3>
                          {quiz.description && (
                            <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
                          )}
                        </div>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                          Quiz
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">{quiz.question_count}</span>
                          <span>Questions</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="font-medium mr-1">{quiz.passing_score}%</span>
                          <span>Passing Score</span>
                        </div>
                        
                        {quiz.time_limit && (
                          <div className="flex items-center">
                            <span className="font-medium mr-1">{quiz.time_limit}</span>
                            <span>min</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleStartQuiz(quiz.id)}
                        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Start Quiz
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Grammar & Vocabulary */}
          <div className="space-y-8">
            {/* Vocabulary */}
            {vocabulary.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Vocabulary</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {vocabulary.length} words
                  </span>
                </div>
                <div className="space-y-4">
                  {vocabulary.map(word => (
                    <VocabularyCard
                      key={word.id}
                      word={word}
                      completed={completedItems.includes(word.id)}
                      onToggleComplete={toggleComplete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Grammar */}
            {grammar.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Grammar Rules</h2>
                <div className="space-y-4">
                  {grammar.map(rule => (
                    <GrammarCard
                      key={rule.id}
                      rule={rule}
                      completed={completedItems.includes(rule.id)}
                      onToggleComplete={toggleComplete}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.push('/lessons')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Lessons
          </button>
          <div className="flex gap-4">
            {quizzes.length > 0 && (
              <button
                onClick={() => handleStartQuiz(quizzes[0].id)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Take Quiz
              </button>
            )}
            <button
              onClick={handleCompleteLesson}
              disabled={progress?.status === 'completed'}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                progress?.status === 'completed'
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {progress?.status === 'completed' ? '✓ Lesson Completed' : 'Complete Lesson'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}