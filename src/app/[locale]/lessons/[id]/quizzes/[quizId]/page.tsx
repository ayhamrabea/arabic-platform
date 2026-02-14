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
  useGetQuizByIdQuery,
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
import QuestionRenderer from '@/components/QuestionRenderer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BackButton } from '@/components/ui/BackButton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import QuizHeader from '@/components/quiz/QuizHeader'
import WarningModal from '@/components/quiz/WarningModal'

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
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // API Calls
  const { data: questions = [], isLoading, isError, error } = useGetQuizQuestionsQuery(quizId)
  const [startQuizAttempt] = useStartQuizAttemptMutation()
  const [submitQuizAnswer] = useSubmitQuizAnswerMutation()
  const [completeQuizAttempt] = useCompleteQuizAttemptMutation()
  
  const [attemptId, setAttemptId] = useState<string | null>(null)

  // Fetch quiz result if attemptId exists and quiz is completed
  const { data: quizResult } = useGetQuizResultQuery(attemptId!, { skip: !attemptId || !quizCompleted })

  const { data: QuizzeInfo } = useGetQuizByIdQuery(quizId)
  
  const [showWarningModal, setShowWarningModal] = useState(false)


  // الحصول على السؤال الحالي
  const currentQuestion = useMemo(() => {
    return questions && questions.length > 0 && currentQuestionIndex < questions.length 
      ? questions[currentQuestionIndex] 
      : null
  }, [questions, currentQuestionIndex])

  // ✅ التحقق من الإجابة على جميع الأسئلة
  const isAllQuestionsAnswered = useMemo(() => {
    return questions.length > 0 && Object.keys(answers).length === questions.length
  }, [questions, answers])

  // Initialize quiz timer if time limit exists
  useEffect(() => {
    const quizTimeLimit = QuizzeInfo?.time_limit // minutes
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
        router.push('/login')
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
        setQuestionStartTime(new Date())
      } else {
        handleCompleteQuiz()
      }
    } catch (error) {
      console.error('Failed to submit answer:', error)
    }
  }

  // ✅ Complete the entire quiz - مع منع إنهاء الاختبار إذا لم تكتمل الإجابات
  const handleCompleteQuiz = async () => {
    if (!attemptId) return

    // ✅ منع إنهاء الاختبار إذا لم يتم الإجابة على كل الأسئلة
    if (!isAllQuestionsAnswered) {
      setShowWarningModal(true)
      return
  }

    try {
      setIsSubmitting(true)
      const result = await completeQuizAttempt({ attemptId }).unwrap()
      setQuizCompleted(true)
      router.push(`/${locale}/lessons/${lessonId}/quizzes/${quizId}/results?attempt=${attemptId}`)
    } catch (error) {
      console.error('Failed to complete quiz:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Navigate to specific question
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      const question = questions[index]
      setCurrentQuestionIndex(index)
      setSelectedAnswer(answers[question.id]?.answer || '')
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

  // Loading state
    if (isLoading) return <LoadingSpinner messageKey={'loading'} />
  

  // Error state
  if (isError || !questions || questions.length === 0) {
      return (
        <div className="max-w-4xl mx-auto">
          <BackButton href="/lessons" textKey={'back'} />
          <ErrorMessage messageErrorKey={t('error')} />
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
                      <p className="text-lg font-semibold">{QuizzeInfo?.time_limit} {t('minutes')} </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">{t('passingScore')}</p>
                      <p className="text-lg font-semibold">{QuizzeInfo?.passing_score} %</p>
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
    <>
    <div className=" relative min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Quiz Header */}
        <QuizHeader
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            timeRemaining={timeRemaining}
            formatTime={formatTime}
            flaggedQuestions={flaggedQuestions}
            currentQuestionId={currentQuestion?.id}
            onToggleFlag={toggleFlagQuestion}
            progressPercentage={progressPercentage}
            translations={{
              question: t('question'),
              of: t('of'),
              flagged: t('flagged'),
              flag: t('flag')
            }}
        />

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

              {/* ✅ Complete Quiz Button - معطل إذا لم تكتمل الإجابات */}
              <button
                onClick={handleCompleteQuiz}
                disabled={isSubmitting || !isAllQuestionsAnswered}
                className={`
                  w-full mt-4 px-4 py-3 rounded-lg transition-all font-medium
                  ${isAllQuestionsAnswered
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {isSubmitting 
                  ? t('submitting') 
                  : isAllQuestionsAnswered 
                    ? t('submitQuiz') 
                    : t('answerAllFirst')}
              </button>

              {/* ✅ رسالة توضيحية إذا لم تكتمل الإجابات */}
              {!isAllQuestionsAnswered && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  ⚠️ {t('mustAnswerAll')}
                </p>
              )}
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
                    <h2
                      className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: currentQuestion.question_text,
                      }}
                    />

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
                  <QuestionRenderer
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onAnswerChange={setSelectedAnswer}
                  />

                  {/* Navigation Buttons - بدون أي تغيير */}
                  <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
                    <button
                        onClick={() => goToQuestion(currentQuestionIndex - 1)}
                        disabled={currentQuestionIndex === 0}
                        className={`
                          flex items-center justify-center px-4 py-3 md:px-6 md:py-3 rounded-lg font-medium transition-colors
                          ${currentQuestionIndex === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                      <ChevronLeftIcon className="h-5 w-5 mr-2" />
                      {t('previous')}
                    </button>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {currentQuestionIndex < questions.length - 1 ? (
                        <>
                          {/* ✅ زر التخطي - بدون أي تغيير */}
                          <button
                              onClick={() => goToQuestion(currentQuestionIndex + 1)}
                              className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                            {t('skip')}
                            <ChevronRightIcon className="h-5 w-5 ml-2" />
                          </button>

                          {/* ✅ زر الإرسال - بدون أي تغيير */}
                          <button
                              onClick={handleSubmitAnswer}
                              disabled={!selectedAnswer}
                              className={`
                                flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors
                                ${!selectedAnswer
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                                }
                              `}
                            >
                              <span className="sm:hidden">{t('submitNext')}</span>
                              <ChevronRightIcon className="h-5 w-5 ml-2 hidden sm:block" />
                            </button>
                        </>
                      ) : (
                        /* ✅ السؤال الأخير - بدون أي تغيير */
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={!selectedAnswer}
                          className={`
                            flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors w-full
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

    <WarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        answeredCount={Object.keys(answers).length}
        totalQuestions={questions.length}
        translations={{
          title: t('answerAllQuestionsFirst'),
          message: t('mustAnswerAll'),
          answered: t('answered'),
          remainingQuestions: t('remainingQuestions'),
          continueQuiz: t('continueQuiz')
        }}
      />
    
    </>

  )
}