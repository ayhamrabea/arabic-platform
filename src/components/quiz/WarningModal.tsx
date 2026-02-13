// components/quiz/WarningModal.tsx
'use client'

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'

interface WarningModalProps {
  isOpen: boolean
  onClose: () => void
  answeredCount: number
  totalQuestions: number
  translations: {
    title: string
    message: string
    answered: string
    remainingQuestions: string
    continueQuiz: string
  }
}

export default function WarningModal({
  isOpen,
  onClose,
  answeredCount,
  totalQuestions,
  translations
}: WarningModalProps) {
  
  // منع التمرير خلف المودال
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const remainingCount = totalQuestions - answeredCount

  return (
    <div 
      className="absolute top-1/2 left-1/2 inset-0 z-[9999] translate-x-1/2 translate-y-1/2"

      onClick={onClose}
    >
      {/* منع إغلاق المودال عند النقر على المحتوى */}
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100 opacity-100 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* أيقونة */}
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-full p-3">
            <ExclamationTriangleIcon className="h-12 w-12 text-amber-600" />
          </div>
        </div>
        
        {/* العنوان */}
        <h3 
          id="modal-title"
          className="text-2xl font-bold text-center text-gray-900 mb-2"
        >
          {translations.title}
        </h3>
        
        {/* الرسالة */}
        <p className="text-center text-gray-600 mb-6">
          {translations.message}
        </p>
        
        {/* الإحصائيات */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-medium">{translations.answered}</span>
            <span className="text-2xl font-bold text-amber-600">
              {answeredCount}/{totalQuestions}
            </span>
          </div>
          
          {/* شريط التقدم */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
          
          {/* الرسالة المتبقية */}
          <p className="text-xs text-gray-500 mt-2 text-center">
            {remainingCount} {translations.remainingQuestions}
          </p>
        </div>
        
        {/* أزرار */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            {translations.continueQuiz}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}