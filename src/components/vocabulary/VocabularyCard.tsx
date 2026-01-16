'use client'

import { SpeakerWaveIcon, CheckCircleIcon , HeartIcon  } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'

import type { Vocabulary } from '@/store/apis/lessonsApi/types'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { getDifficultyColor } from '../favorites/helpers'

interface VocabularyCardProps {
  word: Vocabulary
  completed?: boolean
  isFavorite?: boolean
  onToggleComplete?: (id: string) => void
  onToggleFavorite?: (id: string) => void
}

export function VocabularyCard({
  word,
  completed = false,
  isFavorite,
  onToggleComplete,
  onToggleFavorite
}: VocabularyCardProps) {
  const t = useTranslations('VocabularyCard')

  const handleClick = () => {
    onToggleComplete?.(word.id)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite?.(word.id)
  }

  const { play } = useAudioPlayer()

  return (
    <div
      onClick={handleClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all transform hover:scale-[1.01] ${
        completed
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm'
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h3 className={`font-bold text-xl ${completed ? 'text-blue-800' : 'text-gray-900'}`}>
                {word.word}
              </h3>

              {word.audio_url && (
                <button
                  onClick={(e) => play(word.audio_url, e)}
                  className={`p-2 rounded-full ${
                    completed ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <SpeakerWaveIcon
                    className={`h-4 w-4 ${completed ? 'text-blue-600' : 'text-gray-600'}`}
                  />
                </button>
              )}

              {/* زر المفضلة */}
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

            </div>

            <div className="flex items-center gap-3">
              {word.difficulty_score !== null && word.difficulty_score !== undefined && (
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                    word.difficulty_score
                  )}`}
                >
                  {t('level')} {word.difficulty_score}
                </span>
              )}

              {completed && (
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {t('learned')}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">{t('translation')}</p>
              <p className={`font-medium ${completed ? 'text-blue-700' : 'text-gray-900'}`}>
                {word.translation}
              </p>
            </div>

            {word.pronunciation && (
              <div>
                <p className="text-xs text-gray-500 mb-1">{t('pronunciation')}</p>
                <p className={`font-mono ${completed ? 'text-blue-700' : 'text-gray-700'}`}>
                  {word.pronunciation}
                </p>
              </div>
            )}

            {word.word_type && (
              <div>
                <p className="text-xs text-gray-500 mb-1">{t('type')}</p>
                <p className={`font-medium ${completed ? 'text-blue-700' : 'text-gray-700'}`}>
                  {word.word_type}
                </p>
              </div>
            )}
          </div>

          {word.example_sentence && (
            <div
              className={`p-3 rounded-lg border ${
                completed ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'
              }`}
            >
              <p className="text-xs font-medium text-gray-500 mb-1">{t('exampleSentence')}</p>
              <p className={`italic ${completed ? 'text-blue-800' : 'text-gray-700'}`}>
                {word.example_sentence}
              </p>
            </div>
          )}
        </div>

        <CheckCircleIcon
          className={`h-6 w-6 transition-colors ${
            completed ? 'text-blue-500' : 'text-gray-300'
          }`}
        />
      </div>
    </div>
  )
}
