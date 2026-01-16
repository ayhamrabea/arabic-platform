// components/favorites/FavoriteVocabularyCard.tsx
'use client'

import { SpeakerWaveIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import type { Vocabulary } from '@/store/apis/lessonsApi/types'
import { formatDate, getDifficultyColor, getLevelColor } from '@/components/favorites/helpers'

interface FavoriteVocabularyCardProps {
  word: Vocabulary & {
    favorite_id: string
    lesson_level?: string
  }
  onRemoveFavorite: (itemId: string, itemType: 'word' | 'grammar' | 'sentence') => void
  onViewLesson: (lessonId: string) => void
}

export function FavoriteVocabularyCard({
  word,
  onRemoveFavorite,
  onViewLesson
}: FavoriteVocabularyCardProps) {

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (word.audio_url) {
      new Audio(word.audio_url).play()
    }
  }

  

  

  

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-blue-50/50 to-white">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-gray-900">{word.word}</h3>
            {word.audio_url && (
              <button
                onClick={playAudio}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Play pronunciation"
              >
                <SpeakerWaveIcon className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-2">{word.translation}</p>
        </div>
        <button
          onClick={() => onRemoveFavorite(word.id, 'word')}
          className="text-rose-500 hover:text-rose-700 p-1 ml-2 transition-colors"
          title="Remove from favorites"
        >
          <HeartSolid className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {word.lesson_level && (
          <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(word.lesson_level)}`}>
            {word.lesson_level}
          </span>
        )}
        {word.word_type && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {word.word_type}
          </span>
        )}
        {word.difficulty_score !== undefined && (
          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(word.difficulty_score)}`}>
            Level {word.difficulty_score}
          </span>
        )}
      </div>

      {word.example_sentence && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-1">Example:</p>
          <p className="text-sm text-gray-700 italic">{word.example_sentence}</p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={() => onViewLesson(word.lesson_id)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors"
        >
          View Lesson
          <ChevronRightIcon className="h-3 w-3 ml-1" />
        </button>
        <span className="text-xs text-gray-500">
          Added {formatDate(word.created_at)}
        </span>
      </div>
    </div>
  )
}