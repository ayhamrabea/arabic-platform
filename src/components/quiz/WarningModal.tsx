'use client'

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

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

  const [mounted, setMounted] = useState(false)
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null)
  
  useEffect(() => {
    setMounted(true)
    
    // إنشاء عنصر div للمودال إذا لم يكن موجوداً
    let root = document.getElementById('modal-root')
    if (!root) {
      root = document.createElement('div')
      root.id = 'modal-root'
      document.body.appendChild(root)
    }
    setModalRoot(root)
    
    return () => {
      // تنظيف العنصر إذا كان فارغاً
      const root = document.getElementById('modal-root')
      if (root && root.children.length === 0) {
        root.remove()
      }
    }
  }, [])

  // منع تمرير الصفحة الخلفية
  useEffect(() => {
    if (isOpen && mounted) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.position = 'static'
      document.body.style.width = 'auto'
    }
    
    return () => { 
      document.body.style.overflow = 'unset'
      document.body.style.position = 'static'
      document.body.style.width = 'auto'
    }
  }, [isOpen, mounted])

  if (!mounted || !isOpen || !modalRoot) return null

  const remainingCount = totalQuestions - answeredCount

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        pointerEvents: 'auto'
      }}
    >
      {/* طبقة التعتيم - تضمن تغطية كاملة */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
      />

      {/* المودال - في المنتصف تماماً */}
      <div 
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-gray-100"
        style={{
          position: 'relative',
          maxWidth: '90%',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          margin: 'auto',
          zIndex: 100000,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="bg-amber-100 rounded-full p-3">
            <ExclamationTriangleIcon className="h-12 w-12 text-amber-600" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {translations.title}
        </h3>
        <p className="text-center text-gray-600 mb-6">{translations.message}</p>

        <div className="bg-amber-50 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-medium">{translations.answered}</span>
            <span className="text-2xl font-bold text-amber-600">
              {answeredCount}/{totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {remainingCount} {translations.remainingQuestions}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all font-medium text-lg"
        >
          {translations.continueQuiz}
        </button>
      </div>
    </div>,
    modalRoot
  )
}