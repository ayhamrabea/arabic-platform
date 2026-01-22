// app/[locale]/lessons/[id]/quizzes/[quizId]/page.tsx
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
  useGetQuizQuestionsQuery,
  useStartQuizAttemptMutation,
  useSubmitQuizAnswerMutation,
  useCompleteQuizAttemptMutation,
  useGetQuizResultQuery
} from '@/store/apis/quizApi'

// Icons
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FlagIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface Question {
  id: string
  question_text: string
  question_type: string
  options: any
  correct_answer: string
  explanation?: string
  points: number
  difficulty: string
  order_index: number
  question_image_url?: string
  question_audio_url?: string
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('QuizPage')
  
  const { id: lessonId, quizId } = params as { id: string; quizId: string }
  const { user } = useSelector((state: RootState) => state.auth)
  const profileId = user?.id

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [answers, setAnswers] = useState<Record<string, { answer: string; timeSpent: number }>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null)
  
  // State خاصة بالمطابقة
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [shuffledRussianOptions, setShuffledRussianOptions] = useState<string[]>([])
  const [selectedArabic, setSelectedArabic] = useState<string | null>(null)

  // API Calls
  const { data: questions = [], isLoading, isError, error } = useGetQuizQuestionsQuery(quizId)
  const [startQuizAttempt] = useStartQuizAttemptMutation()
  const [submitQuizAnswer] = useSubmitQuizAnswerMutation()
  const [completeQuizAttempt] = useCompleteQuizAttemptMutation()
  
  const [attemptId, setAttemptId] = useState<string | null>(null)

  // Fetch quiz result if attemptId exists and quiz is completed
  const { data: quizResult } = useGetQuizResultQuery(attemptId!, { skip: !attemptId || !quizCompleted })

  // الحصول على السؤال الحالي
  const currentQuestion = useMemo(() => {
    return questions && questions.length > 0 && currentQuestionIndex < questions.length 
      ? questions[currentQuestionIndex] 
      : null
  }, [questions, currentQuestionIndex])

  // إعادة تعيين state المطابقة عند تغيير السؤال
  useEffect(() => {
    if (!currentQuestion || currentQuestion.question_type !== 'matching') {
      setShuffledRussianOptions([])
      setMatches({})
      setSelectedArabic(null)
      return
    }

    const options = currentQuestion.options
    if (options && typeof options === 'object') {
      const russianOptions = options['الروسية'] || []
      // خلط الخيارات الروسية مرة واحدة فقط
      const shuffled = [...russianOptions].sort(() => Math.random() - 0.5)
      setShuffledRussianOptions(shuffled)
    }
    
    // إعادة تعيين matches و selectedArabic
    setMatches({})
    setSelectedArabic(null)
    setSelectedAnswer('')
  }, [currentQuestion])

  // تصحيح: تحويل options إلى مصفوفة إذا كانت كائن
  const getQuestionOptions = useCallback((question: Question | null): string[] => {
    if (!question || !question.options) return []
    
    if (Array.isArray(question.options)) {
      return question.options
    }
    
    if (typeof question.options === 'object') {
      if (question.question_type === 'matching') {
        return []
      } else {
        const optionsArray = Object.values(question.options)
        if (Array.isArray(optionsArray) && optionsArray.length > 0) {
          return optionsArray.map(opt => String(opt))
        }
      }
    }
    
    if (typeof question.options === 'string') {
      try {
        const parsed = JSON.parse(question.options)
        if (Array.isArray(parsed)) {
          return parsed
        }
      } catch (e) {
        console.error('Failed to parse options string:', e)
      }
    }
    
    return []
  }, [])

  // تحويل نوع الإجابة الصحيحة بناءً على نوع السؤال
  const getCorrectAnswer = useCallback((question: Question | null): string => {
    if (!question || !question.correct_answer) return ''
    
    if (typeof question.correct_answer === 'object') {
      return JSON.stringify(question.correct_answer)
    }
    
    return String(question.correct_answer)
  }, [])

  // دالة جديدة لمعالجة المطابقة
  const handleMatch = useCallback((arabic: string, russian: string) => {
    const newMatches = { ...matches, [arabic]: russian }
    setMatches(newMatches)
    
    // تحويل المطابقات إلى string للإجابة
    const answerString = JSON.stringify(newMatches)
    setSelectedAnswer(answerString)
    setSelectedArabic(null)
  }, [matches])

  // دالة لإلغاء المطابقة
  const removeMatch = useCallback((arabic: string) => {
    const newMatches = { ...matches }
    delete newMatches[arabic]
    setMatches(newMatches)
    
    const answerString = JSON.stringify(newMatches)
    setSelectedAnswer(answerString)
  }, [matches])

  // Initialize quiz timer if time limit exists
  useEffect(() => {
    const quizTimeLimit = 20 // minutes
    if (quizStarted && quizTimeLimit) {
      setTimeRemaining(quizTimeLimit * 60)
    }
  }, [quizStarted])

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || quizCompleted) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          handleCompleteQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, quizCompleted])

  



  // Start quiz
  const handleStartQuiz = async () => {
    if (!profileId) {
      // المستخدم غير مسجل دخول
      return
    }

    try {
      const result = await startQuizAttempt({ quizId, profileId }).unwrap()

      setAttemptId(result.id)
      setQuizStarted(true)
      setStartTime(new Date())
      setQuestionStartTime(new Date())

    } catch (error: any) {
      console.error('Failed to start quiz:', error)

      // ===============================
      // المستخدم نجح سابقًا
      // ===============================
      // if (error?.status === 403) {
      //   alert('لقد اجتزت هذا الاختبار بنجاح ولا يمكنك إعادته ✅')

      //   // خيار 1 (موصى به): الذهاب إلى صفحة النتائج
      //   router.push(
      //     `/${locale}/lessons/${lessonId}/quizzes/${quizId}`
      //   )
      //   return
      // }

      // ===============================
      // أخطاء أخرى
      // ===============================
      // alert('حدث خطأ أثناء بدء الاختبار، حاول مرة أخرى')
    }
  }


  // Submit answer for current question
  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !attemptId || !currentQuestion) return

    try {
      const timeSpent = questionStartTime 
        ? Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000)
        : 0

      await submitQuizAnswer({
        attemptId,
        questionId: currentQuestion.id,
        selectedAnswer,
        timeSpent
      }).unwrap()

      // Save answer locally
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: { answer: selectedAnswer, timeSpent }
      }))

      // Move to next question or complete quiz
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer('')
        setShowExplanation(false)
        setQuestionStartTime(new Date())
      } else {
        handleCompleteQuiz()
      }
    } catch (error) {
      console.error('Failed to submit answer:', error)
    }
  }

  // Complete the entire quiz
  const handleCompleteQuiz = async () => {
  if (!attemptId) return

  try {
    // تعديل هنا: استدعاء completeQuizAttempt واستقبال البيانات الجديدة
    const result = await completeQuizAttempt({ attemptId }).unwrap()
    
    setQuizCompleted(true)
    
    // يمكنك تخزين عدد الاختبارات المكتملة في state إذا أردت عرضه
    console.log('Total completed quizzes:', result.completedCount)
    console.log('Total completed passedCount:', result.passedCount)

    // ثم التوجيه لصفحة النتائج
    router.push(`/${locale}/lessons/${lessonId}/quizzes/${quizId}/results?attempt=${attemptId}`)
  } catch (error) {
    console.error('Failed to complete quiz:', error)
  }
}


  // Navigate to specific question
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      const question = questions[index]
      setCurrentQuestionIndex(index)
      setSelectedAnswer(answers[question.id]?.answer || '')
      setShowExplanation(false)
      setQuestionStartTime(new Date())
    }
  }

  // Toggle flag for current question
  const toggleFlagQuestion = () => {
    if (!currentQuestion) return
    const newFlagged = new Set(flaggedQuestions)
    if (newFlagged.has(currentQuestion.id)) {
      newFlagged.delete(currentQuestion.id)
    } else {
      newFlagged.add(currentQuestion.id)
    }
    setFlaggedQuestions(newFlagged)
  }

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100

  // Get options for current question
  const currentQuestionOptions = getQuestionOptions(currentQuestion)
  const currentQuestionCorrectAnswer = getCorrectAnswer(currentQuestion)

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">{t('loadingQuestions')}</p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('errorLoading')}</h2>
          <p className="text-gray-600 mb-6">{(error as any)?.data?.error || t('errorMessage')}</p>
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

  // No questions found
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('noQuestions')}</h2>
          <p className="text-gray-600 mb-6">{t('noQuestionsDescription')}</p>
          <button
            onClick={() => router.push(`/${locale}/lessons/${lessonId}/quizzes`)}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {t('backToQuizzes')}
          </button>
        </div>
      </div>
    )
  }

  // Quiz not started yet
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push(`/${locale}/lessons/${lessonId}/quizzes`)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-2" />
              {t('backToQuizzes')}
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {t('quizReady')}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Quiz Info */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">{t('totalQuestions')}</p>
                      <p className="text-lg font-semibold">{questions.length} {t('questions')}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">{t('timeLimit')}</p>
                      <p className="text-lg font-semibold">20 {t('minutes')}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">{t('passingScore')}</p>
                      <p className="text-lg font-semibold">70%</p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="font-bold text-blue-800 mb-2">{t('instructions')}</h3>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• {t('instruction1')}</li>
                    <li>• {t('instruction2')}</li>
                    <li>• {t('instruction3')}</li>
                    <li>• {t('instruction4')}</li>
                    <li>• {t('instruction5')}</li>
                  </ul>
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <button
                  onClick={handleStartQuiz}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  {t('startQuiz')}
                </button>
                <p className="text-gray-500 text-sm mt-4">
                  {t('quizWillStart')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz in progress
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Quiz Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Progress Bar */}
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  {t('question')} {currentQuestionIndex + 1} {t('of')} {questions.length}
                </span>
                <span className="font-semibold">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Timer */}
            {timeRemaining !== null && (
              <div className="flex items-center bg-red-50 px-4 py-2 rounded-lg">
                <ClockIcon className="h-5 w-5 text-red-500 mr-2" />
                <span className={`font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}

            {/* Flag Button */}
            <button
              onClick={toggleFlagQuestion}
              disabled={!currentQuestion}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                !currentQuestion
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : flaggedQuestions.has(currentQuestion.id)
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FlagIcon className="h-5 w-5 mr-2" />
              {currentQuestion && flaggedQuestions.has(currentQuestion.id) ? t('flagged') : t('flag')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">{t('questions')}</h3>
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-2">
                {questions.map((question: Question, index: number) => (
                  <button
                    key={question.id}
                    onClick={() => goToQuestion(index)}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                      ${index === currentQuestionIndex 
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-300' 
                        : answers[question.id]
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : flaggedQuestions.has(question.id)
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {index + 1}
                    {flaggedQuestions.has(question.id) && (
                      <FlagIcon className="h-3 w-3 ml-1" />
                    )}
                  </button>
                ))}
              </div>

              {/* Quiz Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{t('answered')}</span>
                  <span className="font-semibold">
                    {Object.keys(answers).length}/{questions.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{t('flagged')}</span>
                  <span className="font-semibold">{flaggedQuestions.size}</span>
                </div>
              </div>

              {/* Complete Quiz Button */}
              <button
                onClick={handleCompleteQuiz}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all font-medium"
              >
                {t('submitQuiz')}
              </button>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {!currentQuestion ? (
                <div className="text-center py-8">
                  <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لا يوجد سؤال حالي</p>
                </div>
              ) : (
                <>
                  {/* Question Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                          {t('question')} {currentQuestion.order_index || currentQuestionIndex + 1}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {currentQuestion.difficulty === 'easy' ? t('easy') :
                          currentQuestion.difficulty === 'medium' ? t('medium') : t('hard')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {currentQuestion.points} {t('points')}
                      </p>
                    </div>

                    {currentQuestion.question_image_url && (
                      <button
                        onClick={() => window.open(currentQuestion.question_image_url, '_blank')}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        {t('viewImage')}
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                      {currentQuestion.question_text}
                    </h2>

                    {currentQuestion.question_image_url && (
                      <div className="mb-6">
                        <img 
                          src={currentQuestion.question_image_url} 
                          alt={t('questionImage')}
                          className="max-w-full h-auto rounded-lg border border-gray-200"
                        />
                      </div>
                    )}

                    {currentQuestion.question_audio_url && (
                      <div className="mb-6">
                        <audio controls className="w-full">
                          <source src={currentQuestion.question_audio_url} type="audio/mpeg" />
                          {t('audioNotSupported')}
                        </audio>
                      </div>
                    )}
                  </div>

                  {/* Answer Options */}
                  {currentQuestion.question_type === 'multiple_choice' && (
                    <div className="space-y-4 mb-8">
                      {currentQuestionOptions.map((option: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAnswer(option)}
                          className={`
                            w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                            ${selectedAnswer === option
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
                          `}
                        >
                          <div className="flex items-center">
                            <div className={`
                              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4
                              ${selectedAnswer === option
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                              }
                            `}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-lg">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {currentQuestion.question_type === 'true_false' && (
                    <div className="space-y-4 mb-8">
                      {['صحيح', 'خَطَأ'].map((option: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAnswer(option)}
                          className={`
                            w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                            ${selectedAnswer === option
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
                          `}
                        >
                          <div className="flex items-center">
                            <div className={`
                              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4
                              ${selectedAnswer === option
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                              }
                            `}>
                              {index === 0 ? 'T' : 'F'}
                            </div>
                            <span className="text-lg">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {currentQuestion.question_type === 'fill_blank' && (
                    <div className="space-y-4 mb-8">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-700 mb-2">{t('typeYourAnswer')}</p>
                        <input
                          type="text"
                          value={selectedAnswer}
                          onChange={(e) => setSelectedAnswer(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                          placeholder={t('answerPlaceholder')}
                        />
                      </div>
                    </div>
                  )}

                  {currentQuestion.question_type === 'matching' && (
                    <div className="space-y-6 mb-8">
                      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                        <h4 className="font-bold text-yellow-800 mb-2">تعليمات المطابقة:</h4>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          <li>• انقر على العبارة العربية أولاً</li>
                          <li>• ثم انقر على المعنى الروسي المناسب</li>
                          <li>• ستظهر المطابقة تلقائياً</li>
                          <li>• انقر على ✕ لإلغاء أي مطابقة</li>
                        </ul>
                      </div>
                      
                      {(() => {
                        const options = currentQuestion.options
                        if (!options || typeof options !== 'object') return null
                        
                        const arabicOptions = options['العربية'] || []
                        
                        return (
                          <>
                            {/* عرض المطابقات الحالية */}
                            {Object.keys(matches).length > 0 && (
                              <div className="bg-green-50 p-4 rounded-xl">
                                <h3 className="font-bold text-green-800 mb-3 flex items-center">
                                  <CheckIcon className="h-5 w-5 ml-2" />
                                  المطابقات الحالية:
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {Object.entries(matches).map(([arabic, russian], index) => (
                                    <div key={index} className="bg-white p-3 rounded-lg border border-green-300 shadow-sm">
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                          <div className="font-semibold text-gray-800 text-center mb-1">{arabic}</div>
                                          <div className="text-center">
                                            <span className="text-green-600 mx-2">↓</span>
                                          </div>
                                          <div className="text-gray-700 text-center mt-1">{russian}</div>
                                        </div>
                                        <button
                                          onClick={() => removeMatch(arabic)}
                                          className="text-red-500 hover:text-red-700 mr-2 flex-shrink-0"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* رسالة إذا اكتملت جميع المطابقات */}
                            {Object.keys(matches).length === arabicOptions.length && arabicOptions.length > 0 && (
                              <div className="bg-blue-50 p-4 rounded-xl border border-blue-300">
                                <div className="flex items-center justify-center">
                                  <CheckCircleIcon className="h-6 w-6 text-blue-600 ml-2" />
                                  <span className="text-blue-700 font-bold">تمت مطابقة جميع العبارات بنجاح!</span>
                                </div>
                              </div>
                            )}
                            
                            {/* العبارات العربية */}
                            <div className="bg-blue-50 p-6 rounded-xl">
                              <h3 className="font-bold text-blue-800 mb-4 text-center text-lg">
                                العبارات العربية (انقر لاختيار)
                              </h3>
                              <div className="space-y-3">
                                {arabicOptions.map((arabic: string, index: number) => (
                                  <button
                                    key={index}
                                    onClick={() => setSelectedArabic(arabic === selectedArabic ? null : arabic)}
                                    className={`
                                      w-full p-4 rounded-xl border-2 transition-all duration-200
                                      ${matches[arabic]
                                        ? 'border-green-500 bg-green-50'
                                        : selectedArabic === arabic
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-blue-200 hover:border-blue-300 bg-white'
                                      }
                                    `}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <div className={`
                                          w-8 h-8 rounded-full flex items-center justify-center mr-4
                                          ${matches[arabic]
                                            ? 'bg-green-500 text-white'
                                            : selectedArabic === arabic
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-blue-100 text-blue-800'
                                          }
                                        `}>
                                          {index + 1}
                                        </div>
                                        <span className="text-lg font-semibold">{arabic}</span>
                                      </div>
                                      {matches[arabic] && (
                                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* إذا تم اختيار عبارة عربية، اعرض الخيارات الروسية */}
                            {selectedArabic && (
                              <div className="bg-red-50 p-6 rounded-xl">
                                <h3 className="font-bold text-red-800 mb-4 text-center text-lg">
                                  اختر المعنى الصحيح لـ {selectedArabic}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {shuffledRussianOptions.map((russian: string, index: number) => (
                                    <button
                                      key={index}
                                      onClick={() => handleMatch(selectedArabic, russian)}
                                      disabled={Object.values(matches).includes(russian)}
                                      className={`
                                        p-4 rounded-xl border-2 transition-all duration-200 text-left
                                        ${Object.values(matches).includes(russian)
                                          ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                                          : 'border-red-200 hover:border-red-300 bg-white hover:bg-red-50'
                                        }
                                      `}
                                    >
                                      <div className="flex items-center">
                                        <div className={`
                                          w-8 h-8 rounded-full flex items-center justify-center mr-4
                                          ${Object.values(matches).includes(russian)
                                            ? 'bg-gray-300 text-gray-600'
                                            : 'bg-red-100 text-red-800'
                                          }
                                        `}>
                                          {String.fromCharCode(65 + index)}
                                        </div>
                                        <span className="text-lg">{russian}</span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                                <div className="mt-4 text-center">
                                  <button
                                    onClick={() => setSelectedArabic(null)}
                                    className="text-gray-600 hover:text-gray-800 text-sm"
                                  >
                                    إلغاء الاختيار
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => goToQuestion(currentQuestionIndex - 1)}
                      disabled={currentQuestionIndex === 0}
                      className={`
                        flex items-center px-6 py-3 rounded-lg font-medium transition-colors
                        ${currentQuestionIndex === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      <ChevronLeftIcon className="h-5 w-5 mr-2" />
                      {t('previous')}
                    </button>

                    <div className="flex gap-4">
                      {currentQuestionIndex < questions.length - 1 ? (
                        <>
                          <button
                            onClick={() => goToQuestion(currentQuestionIndex + 1)}
                            className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                          >
                            {t('skip')}
                            <ChevronRightIcon className="h-5 w-5 ml-2" />
                          </button>

                          <button
                            onClick={handleSubmitAnswer}
                            disabled={!selectedAnswer}
                            className={`
                              flex items-center px-6 py-3 rounded-lg font-medium transition-colors
                              ${!selectedAnswer
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                              }
                            `}
                          >
                            {t('submitNext')}
                            <ChevronRightIcon className="h-5 w-5 ml-2" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={!selectedAnswer}
                          className={`
                            flex items-center px-6 py-3 rounded-lg font-medium transition-colors
                            ${!selectedAnswer
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                            }
                          `}
                        >
                          {t('submitFinal')}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Warning if time is low */}
                  {timeRemaining !== null && timeRemaining < 300 && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                        <p className="text-yellow-700 font-medium">
                          {t('timeWarning', { minutes: Math.ceil(timeRemaining / 60) })}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}