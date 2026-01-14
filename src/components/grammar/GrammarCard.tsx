'use client'

import { CheckCircleIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import type { GrammarRule } from '@/store/apis/lessonsApi/types'

interface GrammarCardProps {
  rule: GrammarRule
  completed?: boolean
  onToggleComplete?: (id: string) => void
}

export function GrammarCard({
  rule,
  completed = false,
  onToggleComplete
}: GrammarCardProps) {

  const handleClick = () => {
    onToggleComplete?.(rule.id)
  }

  const renderExamples = () => {
    if (!rule.examples) return null

    if (typeof rule.examples === 'string') {
      return rule.examples
    }

    if (Array.isArray(rule.examples)) {
      return (
        <div className="space-y-2">
          {rule.examples.map((ex: string, index: number) => (
            <div key={index} className="flex items-start">
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

              {completed && (
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  Completed
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
              <p className="text-xs font-medium text-gray-500 mb-2">EXAMPLES:</p>
              <div className="text-sm">{renderExamples()}</div>
            </div>
          )}

          {rule.exceptions && (
            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-xs font-medium text-red-600 mb-1">EXCEPTIONS:</p>
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