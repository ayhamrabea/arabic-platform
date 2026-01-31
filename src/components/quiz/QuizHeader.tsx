'use client'

import { ClockIcon, FlagIcon } from '@heroicons/react/24/outline'

interface QuizHeaderProps {
  currentQuestionIndex: number
  totalQuestions: number
  timeRemaining: number | null
  formatTime: (seconds: number) => string
  flaggedQuestions: Set<string>
  currentQuestionId: string | undefined
  onToggleFlag: () => void
  progressPercentage: number
  translations: {
    question: string
    of: string
    flagged: string
    flag: string
  }
}

export default function QuizHeader({
  currentQuestionIndex,
  totalQuestions,
  timeRemaining,
  formatTime,
  flaggedQuestions,
  currentQuestionId,
  onToggleFlag,
  progressPercentage,
  translations
}: QuizHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Progress Bar */}
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">
              {translations.question} {currentQuestionIndex + 1} {translations.of} {totalQuestions}
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
          onClick={onToggleFlag}
          disabled={!currentQuestionId}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            !currentQuestionId
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : flaggedQuestions.has(currentQuestionId)
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FlagIcon className="h-5 w-5 mr-2" />
          {currentQuestionId && flaggedQuestions.has(currentQuestionId) ? translations.flagged : translations.flag}
        </button>
      </div>
    </div>
  )
}