// app/[locale]/lessons/[id]/quizzes/[quizId]/results/page.tsx
'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useGetQuizResultQuery } from '@/store/apis/quizApi'
import { useState, useMemo } from 'react'

// Icons
import {
  TrophyIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowPathIcon,
  HomeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeSlashIcon,
  FlagIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

interface QuizAnswer {
  id: string
  question_id: string
  question_text: string
  question_type?: string  // جعلها اختيارية
  questionType?: string   // أضف نسخة أخرى للاسم
  user_answer?: any
  userAnswer?: any        // أضف نسخة أخرى للاسم
  correct_answer?: any
  correctAnswer?: any     // أضف نسخة أخرى للاسم
  is_correct: boolean
  isCorrect?: boolean     // أضف نسخة أخرى للاسم
  time_spent: number
  timeSpent?: number      // أضف نسخة أخرى للاسم
  points_awarded: number
  pointsAwarded?: number  // أضف نسخة أخرى للاسم
  explanation?: string
  options?: any
  difficulty: string
}

interface QuizResult {
  id: string
  quiz_id: string
  profile_id: string
  score: number
  total_questions: number
  correct_answers: number
  time_spent: number
  completed_at: string
  answers: QuizAnswer[]
}

// Helper function to get value from object with multiple possible keys
const getValue = (obj: any, keys: string[]): any => {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null) {
      return obj[key]
    }
  }
  return undefined
} 

// Helper function to safely stringify values
const safeStringify = (value: any): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'object') {
    try {
      // إذا كان كائن matching، اعرضه بشكل مرتب
      if (!Array.isArray(value) && Object.keys(value).length > 0) {
        const entries = Object.entries(value)
        return entries.map(([key, val]) => `${key} → ${val}`).join(', ')
      }
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

// Helper function to parse answer value
const parseAnswerValue = (value: any): any => {
  if (!value) return null
  
  // If it's already an object, return it
  if (typeof value === 'object') return value
  
  // If it's a string, try to parse it as JSON
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed
    } catch {
      return value
    }
  }
  
  return value
}

export default function QuizResultsPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations('QuizResultsPage')
  
  const { id: lessonId, quizId } = params as { id: string; quizId: string }
  const attemptId = searchParams.get('attempt')

  const { data: result, isLoading, isError } = useGetQuizResultQuery(attemptId!, { 
    skip: !attemptId 
  }) as { data: QuizResult, isLoading: boolean, isError: boolean }

  // State
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(new Set())
  const [showAllAnswers, setShowAllAnswers] = useState(false)
  const [showCorrectOnly, setShowCorrectOnly] = useState(false)

  const getUserAnswer = (answer: QuizAnswer): any => {
  // جرب كل الأسماء المحتملة للإجابة
  const possibleKeys = [
    'selected_answer',  // هذا هو الحقل الفعلي الذي تخزن فيه
    'selectedAnswer',
    'selected_option',
    'answer',
    'user_answer', 
    'userAnswer',
    'chosen_answer',
    'response'
  ]
  
  // Debug: عرض كل مفاتيح الإجابة
  console.log('All answer keys:', Object.keys(answer))
  console.log('Full answer object:', answer)
  
  const userAnswer = getValue(answer, possibleKeys)
  
  return userAnswer
}
  // Calculations
  const stats = useMemo(() => {
    if (!result) return null
    
    const correctAnswers = result.answers?.filter(a => 
      getValue(a, ['is_correct', 'isCorrect']) === true
    ).length || 0
    const totalQuestions = result.total_questions || 0
    const wrongAnswers = totalQuestions - correctAnswers
    const isPassed = result.score >= 70
    
    return { correctAnswers, totalQuestions, wrongAnswers, isPassed }
  }, [result])

  // Helper functions
  const toggleAnswer = (answerId: string) => {
    const newExpanded = new Set(expandedAnswers)
    newExpanded.has(answerId) ? newExpanded.delete(answerId) : newExpanded.add(answerId)
    setExpandedAnswers(newExpanded)
  }

  const toggleAllAnswers = () => {
    if (showAllAnswers) {
      setExpandedAnswers(new Set())
    } else {
      const allIds = new Set(result?.answers?.map(answer => answer.id) || [])
      setExpandedAnswers(allIds)
    }
    setShowAllAnswers(!showAllAnswers)
  }

  // Render answer content
  const renderAnswerContent = (answer: QuizAnswer) => {
    // الحصول على القيم مع تعدد الاحتمالات للأسماء
    const questionType = getValue(answer, ['question_type', 'questionType'])
    
    const userAnswer = getUserAnswer(answer)
    const correctAnswer = getValue(answer, ['correct_answer', 'correctAnswer'])
    const isCorrect = getValue(answer, ['is_correct', 'isCorrect']) === true
    const timeSpent = getValue(answer, ['time_spent', 'timeSpent']) || 0
    const pointsAwarded = getValue(answer, ['points_awarded', 'pointsAwarded']) || 0
    
    // Debug log
    console.log('Answer debug:', {
      answer: answer,
      questionType: questionType,
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect
    })
    
    // محاولة تحديد نوع السؤال من محتوى الإجابة
    let detectedQuestionType = questionType
    if (!detectedQuestionType) {
      const parsedCorrectAnswer = parseAnswerValue(correctAnswer)
      if (parsedCorrectAnswer && typeof parsedCorrectAnswer === 'object' && !Array.isArray(parsedCorrectAnswer)) {
        detectedQuestionType = 'matching'
      } else {
        detectedQuestionType = 'default'
      }
    }
    
    switch (detectedQuestionType) {
      case 'matching':
        const userMatches = parseAnswerValue(userAnswer)
        const correctMatches = parseAnswerValue(correctAnswer)
        
        // Check if it's a matching object
        const isMatchingObject = correctMatches && 
          typeof correctMatches === 'object' && 
          !Array.isArray(correctMatches)
        
        if (isMatchingObject) {
          return (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  {t('yourAnswer')}
                </h4>
                {userMatches && Object.keys(userMatches).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(userMatches).map(([arabic, russian], idx) => (
                      <div key={idx} className={`p-3 rounded-lg border ${
                        userMatches[arabic] === correctMatches?.[arabic] 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex flex-col items-center">
                          <div className="font-medium text-gray-800 text-center mb-1">{arabic}</div>
                          <div className="text-gray-500 text-sm mb-1">→</div>
                          <div className="text-gray-700 text-center">{russian as string}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 italic text-center">{t('noAnswerProvided')}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  {t('correctAnswer')}
                </h4>
                {correctMatches && Object.keys(correctMatches).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(correctMatches).map(([arabic, russian], idx) => (
                      <div key={idx} className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex flex-col items-center">
                          <div className="font-medium text-gray-800 text-center mb-1">{arabic}</div>
                          <div className="text-green-600 text-sm mb-1">✓</div>
                          <div className="text-gray-700 text-center">{russian as string}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 italic text-center">{t('noAnswerProvided')}</p>
                  </div>
                )}
              </div>
            </div>
          )
        }
        // If not a matching object, fall through to default

      default:
        return (
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-700">
                {t('yourAnswer')}:{' '}
              </span>
              <span className={`px-3 py-1 rounded-full ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {safeStringify(userAnswer) || t('noAnswer')}
              </span>
            </div>
            {!isCorrect && (
              <div>
                <span className="font-semibold text-gray-700">
                  {t('correctAnswer')}:{' '}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                  {safeStringify(correctAnswer)}
                </span>
              </div>
            )}
          </div>
        )
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">{t('loadingResults')}</p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('errorLoading')}</h2>
          <p className="text-gray-600 mb-6">{t('errorMessage')}</p>
          <button
            onClick={() => router.push(`/${locale}/lessons/${lessonId}/quizzes`)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            {t('backToQuizzes')}
          </button>
        </div>
      </div>
    )
  }

  const direction = locale === 'ar' ? 'rtl' : 'ltr'
  const isRTL = direction === 'rtl'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8" dir={direction}>
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {t('quizResults')}
                </h1>
                <p className="text-blue-100">
                  {stats?.isPassed ? t('passedMessage') : t('failedMessage')}
                </p>
              </div>
              <div className="mt-4 md:mt-0 text-center">
                <div className="text-5xl font-bold">{result.score}%</div>
                <div className="text-blue-200">{t('score')}</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900">{stats?.totalQuestions}</div>
                <p className="text-gray-600 text-sm">{t('totalQuestions')}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-700">{stats?.correctAnswers}</div>
                <p className="text-green-600 text-sm">{t('correctAnswers')}</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-xl text-center">
                <XCircleIcon className="h-8 w-8 text-red-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-red-700">{stats?.wrongAnswers}</div>
                <p className="text-red-600 text-sm">{t('wrongAnswers')}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <ClockIcon className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-700">{result.time_spent}s</div>
                <p className="text-purple-600 text-sm">{t('timeSpent')}</p>
              </div>
            </div>

            {/* Performance Message */}
            <div className={`p-4 rounded-xl mb-8 ${
              stats?.isPassed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {stats?.isPassed ? (
                  <>
                    <CheckCircleIcon className={`h-5 w-5 text-green-600 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                    <div>
                      <p className="font-medium text-green-800">
                        {t('passedMessage')}
                      </p>
                      <p className="text-green-700 text-sm mt-1">
                        {t('tipPassed1')}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircleIcon className={`h-5 w-5 text-red-600 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                    <div>
                      <p className="font-medium text-red-800">
                        {t('failedMessage')}
                      </p>
                      <p className="text-red-700 text-sm mt-1">
                        {t('tipFailed1')}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Answers Header with Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t('detailedResults')}
                </h2>
                <p className="text-gray-600 text-sm">
                  {t('clickForDetails')}
                </p>
              </div>
              
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={toggleAllAnswers}
                  className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
                >
                  {showAllAnswers ? (
                    <>
                      <EyeSlashIcon className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('hideAll')}
                    </>
                  ) : (
                    <>
                      <EyeIcon className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('showAll')}
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setShowCorrectOnly(!showCorrectOnly)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                    showCorrectOnly 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CheckCircleIcon className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {showCorrectOnly ? t('showAll') : t('correctOnly')}
                </button>
              </div>
            </div>

            {/* Answers List */}
            <div className="space-y-4">
              {result.answers && result.answers.length > 0 ? (
                result.answers
                  .filter(answer => {
                    if (showCorrectOnly) {
                      const isCorrect = getValue(answer, ['is_correct', 'isCorrect']) === true
                      return isCorrect
                    }
                    return true
                  })
                  .map((answer, index) => {
                    const isCorrect = getValue(answer, ['is_correct', 'isCorrect']) === true
                    const timeSpent = getValue(answer, ['time_spent', 'timeSpent']) || 0
                    const pointsAwarded = getValue(answer, ['points_awarded', 'pointsAwarded']) || 0
                    
                    return (
                      <div
                        key={answer.id}
                        className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                          isCorrect 
                            ? 'border-green-200 hover:border-green-300' 
                            : 'border-red-200 hover:border-red-300'
                        }`}
                      >
                        <button
                          onClick={() => toggleAnswer(answer.id)}
                          className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'} ${
                                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {answer.question_text}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    isCorrect 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {isCorrect ? t('correct') : t('incorrect')}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {timeSpent}s
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {pointsAwarded} {t('points')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              {expandedAnswers.has(answer.id) ? (
                                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                          </div>
                        </button>
                        
                        {/* Expanded Content */}
                        {expandedAnswers.has(answer.id) && (
                          <div className="p-4 bg-white border-t">
                            {renderAnswerContent(answer)}
                            
                            {/* Explanation if available */}
                            {answer.explanation && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-semibold text-blue-800 mb-2">
                                  {t('explanation')}
                                </h4>
                                <p className="text-blue-700">{answer.explanation}</p>
                              </div>
                            )}
                            
                            {/* Improvement tip for wrong answers */}
                            {!isCorrect && (
                              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <h4 className="font-semibold text-yellow-800 mb-2">
                                  {t('improvementTip')}
                                </h4>
                                <p className="text-yellow-700">
                                  {t('tipFailed2')}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t('noAnswersAvailable')}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push(`/${locale}/lessons/${lessonId}/quizzes/${quizId}`)}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all font-medium"
                >
                  <ArrowPathIcon className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('retakeQuiz')}
                </button>

                <button
                  onClick={() => router.push(`/${locale}/lessons/${lessonId}/quizzes`)}
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <TrophyIcon className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('viewAllQuizzes')}
                </button>

                <button
                  onClick={() => router.push(`/${locale}/lessons/${lessonId}`)}
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <HomeIcon className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('backToLesson')}
                </button>
              </div>
            </div>

            {/* Final Tips */}
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <h3 className="font-bold text-purple-800 mb-3">
                {t('improvementTips')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start">
                  <CheckCircleIcon className={`h-5 w-5 text-green-600 ${isRTL ? 'ml-2' : 'mr-2'} mt-0.5 flex-shrink-0`} />
                  <p className="text-purple-700 text-sm">
                    {stats?.isPassed ? t('tipPassed2') : t('tipFailed1')}
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className={`h-5 w-5 text-green-600 ${isRTL ? 'ml-2' : 'mr-2'} mt-0.5 flex-shrink-0`} />
                  <p className="text-purple-700 text-sm">
                    {t('tipGeneral')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}