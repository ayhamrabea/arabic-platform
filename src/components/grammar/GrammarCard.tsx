'use client'

import { CheckCircleIcon, AcademicCapIcon , HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'

import type { GrammarRule } from '@/store/apis/lessonsApi/types'
import { renderExamples } from '../favorites/helpers'

interface GrammarCardProps {
  rule: GrammarRule
  completed?: boolean
  isFavorite?: boolean
  onToggleComplete?: (id: string) => void
  onToggleFavorite?: (id: string) => void
}

export function GrammarCard({
  rule,
  completed = false,
  isFavorite,
  onToggleComplete,
  onToggleFavorite
}: GrammarCardProps) {
  const t = useTranslations('GrammarCard') // ملف الرسائل GrammarCard.json

  const handleClick = () => {
    onToggleComplete?.(rule.id)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite?.(rule.id)
  }

  return (
    <div
      onClick={handleClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all transform hover:scale-[1.01] ${
        completed
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm'
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${completed ? 'bg-green-100' : 'bg-indigo-100'}`}>
              <AcademicCapIcon
                className={`h-5 w-5 ${completed ? 'text-green-600' : 'text-indigo-600'}`}
              />
            </div>

            <div className="flex-1">
              <h3 className={`font-bold text-lg ${completed ? 'text-green-800' : 'text-gray-900'}`}>
                {rule.rule_name}
              </h3>

              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full transition ${
                  isFavorite
                    ? 'bg-red-100 hover:bg-red-200'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {isFavorite ? (
                  <HeartSolid className="h-4 w-4 text-red-500" />
                ) : (
                  <HeartIcon className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {completed && (
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  {t('completed')}
                </span>
              )}
            </div>
          </div>

          {rule.explanation && (
            <p className={`text-sm mb-3 ${completed ? 'text-green-700' : 'text-gray-600'}`}>
              {rule.explanation}
            </p>
          )}

          {rule.examples && (
            <div
              className={`p-3 rounded-lg border ${
                completed
                  ? 'bg-green-50 border-green-100'
                  : 'bg-gray-50 border-gray-100'
              }`}
            >
              <p className="text-xs font-medium text-gray-500 mb-2">{t('examples')}</p>
              <div className="text-sm">{renderExamples(rule)}</div>
            </div>
          )}

          {rule.exceptions && (
            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-xs font-medium text-red-600 mb-1">{t('exceptions')}</p>
              <p className="text-sm text-red-700">{rule.exceptions}</p>
            </div>
          )}
        </div>

        <CheckCircleIcon
          className={`h-6 w-6 transition-colors ${
            completed ? 'text-green-500' : 'text-gray-300'
          }`}
        />
      </div>
    </div>
  )
}
