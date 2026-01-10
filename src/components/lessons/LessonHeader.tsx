// components/lessons/LessonHeader.tsx
import { PlayIcon, BookmarkIcon } from '@heroicons/react/24/outline'

interface LessonHeaderProps {
  title: string
  level: string
  type: string
  duration?: number | null
  description?: string
  onStart: () => void
  onSave: () => void
}

export function LessonHeader({ 
  title, 
  level, 
  type, 
  duration, 
  description,
  onStart,
  onSave
}: LessonHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm font-medium">
              {level}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {type}
            </span>
            {duration && (
              <span className="flex items-center text-gray-600">
                <PlayIcon className="h-4 w-4 mr-1" />
                {duration} min
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          
          {description && (
            <p className="text-gray-600 text-lg mb-6">{description}</p>
          )}
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onStart}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              <PlayIcon className="h-5 w-5 mr-2" />
              Start Lesson
            </button>
            <button 
              onClick={onSave}
              className="flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-indigo-500 hover:text-indigo-600 transition-all"
            >
              <BookmarkIcon className="h-5 w-5 mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}