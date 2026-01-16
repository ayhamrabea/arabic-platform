// components/favorites/FavoriteGrammarCard.tsx
'use client'

import { AcademicCapIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import type { GrammarRule } from '@/store/apis/lessonsApi/types'
import { formatDate, getLevelColor } from './helpers'

interface FavoriteGrammarCardProps {
  rule: GrammarRule & {
    favorite_id: string
    lesson_level?: string
  }
  onRemoveFavorite: (itemId: string, itemType: 'word' | 'grammar' | 'sentence') => void
  onViewLesson: (lessonId: string) => void
}

export function FavoriteGrammarCard({
  rule,
  onRemoveFavorite,
  onViewLesson
}: FavoriteGrammarCardProps) {



  const renderExamples = () => {
    if (!rule.examples) return null

    if (typeof rule.examples === 'string') {
      return rule.examples
    }

    if (Array.isArray(rule.examples)) {
      return (
        <div className="space-y-1">
          {rule.examples.map((ex: string, idx: number) => (
            <div key={idx} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-700">{ex}</span>
            </div>
          ))}
        </div>
      )
    }

    return (
      <pre className="text-sm text-gray-600 whitespace-pre-wrap">
        {JSON.stringify(rule.examples, null, 2)}
      </pre>
    )
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-purple-50/50 to-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-2">{rule.rule_name}</h3>
          <p className="text-gray-600">{rule.explanation}</p>
        </div>
        <button
          onClick={() => onRemoveFavorite(rule.id, 'grammar')}
          className="text-rose-500 hover:text-rose-700 p-1 ml-2 transition-colors"
          title="Remove from favorites"
        >
          <HeartSolid className="h-5 w-5" />
        </button>
      </div>

      {rule.lesson_level && (
        <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(rule.lesson_level)} mb-3 inline-block`}>
          {rule.lesson_level}
        </span>
      )}

      {rule.examples && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-2">Examples:</p>
          <div className="text-sm">{renderExamples()}</div>
        </div>
      )}

      {rule.exceptions && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
          <p className="text-sm font-medium text-red-700 mb-1">Exceptions:</p>
          <p className="text-red-800 text-sm">{rule.exceptions}</p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={() => onViewLesson(rule.lesson_id)}
          className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors"
        >
          View Lesson
          <ChevronRightIcon className="h-3 w-3 ml-1" />
        </button>
        <span className="text-xs text-gray-500">
          Added {formatDate(rule.created_at)}
        </span>
      </div>
    </div>
  )
}