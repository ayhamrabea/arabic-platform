// components/quiz/QuizCelebration.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import {
  TrophyIcon,
  SparklesIcon,
  AcademicCapIcon,
  FaceFrownIcon,
  XMarkIcon
} from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'

interface QuizCelebrationProps {
  score: number
  correctAnswers: number
  totalQuestions: number
  onClose?: () => void
}

export default function QuizCelebration({
  score,
  correctAnswers,
  totalQuestions,
  onClose
}: QuizCelebrationProps) {
  const t = useTranslations('QuizCelebration')
  const { width, height } = useWindowSize()

  const [visible, setVisible] = useState(true)
  const [showConfetti, setShowConfetti] = useState(true)

  const celebrationType = useMemo(() => {
    if (score === 100) return 'perfect'
    if (score >= 90) return 'excellent'
    if (score >= 70) return 'good'
    return 'failed'
  }, [score])

  // 🎨 ألوان ناعمة جداً داخل Light Mode
  const celebrationColors = {
    perfect: 'bg-amber-50 text-amber-600',
    excellent: 'bg-indigo-50 text-indigo-600',
    good: 'bg-emerald-50 text-emerald-600',
    failed: 'bg-gray-100 text-gray-500'
  } as const

  const iconMap = {
    perfect: <TrophyIcon className="h-14 w-14" />,
    excellent: <SparklesIcon className="h-14 w-14" />,
    good: <AcademicCapIcon className="h-14 w-14" />,
    failed: <FaceFrownIcon className="h-14 w-14" />
  }

  useEffect(() => {
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false)
    }, 4000)

    const closeTimer = setTimeout(() => {
      handleClose()
    }, 9000)

    return () => {
      clearTimeout(confettiTimer)
      clearTimeout(closeTimer)
    }
  }, [])

  const handleClose = () => {
    setVisible(false)
    onClose?.()
  }

  if (!visible) return null

  const shouldAnimate = celebrationType !== 'failed'

  return (
    <AnimatePresence>
      {showConfetti && celebrationType !== 'failed' && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Overlay خفيف جداً */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center
                   bg-black/20 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        {/* Card */}
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', damping: 22 }}
          className="relative w-full max-w-lg
                     bg-white/70 backdrop-blur-2xl
                     border border-white/60
                     rounded-3xl
                     shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2
                       rounded-full bg-black/5
                       hover:bg-black/10 transition"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>

          <div className="p-8 text-center">

            {/* Icon Wrapper */}
            <motion.div
              animate={
                shouldAnimate
                  ? { scale: [1, 1.06, 1] }
                  : {}
              }
              transition={{
                repeat: shouldAnimate ? Infinity : 0,
                duration: 2
              }}
              className={`mx-auto mb-5 w-20 h-20 rounded-2xl
                         flex items-center justify-center
                         ${celebrationColors[celebrationType]}`}
            >
              {iconMap[celebrationType]}
            </motion.div>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {t(`${celebrationType}.title`)}
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              {t(`${celebrationType}.message`, { score })}
            </p>

            {/* Score Box */}
            <div className="inline-block bg-gray-50
                            border border-gray-200
                            rounded-2xl px-6 py-4">
              <div className="text-4xl font-bold text-gray-900">
                {score}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {t('score', {
                  correct: correctAnswers,
                  total: totalQuestions
                })}
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-400 sm:hidden">
              {t('tapToClose')}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
