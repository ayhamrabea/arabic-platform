// components/lessons/LessonNavigation.tsx
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface LessonNavigationProps {
  onPrevious: () => void
  onComplete: () => void
  onNext: () => void
}

export function LessonNavigation({ 
  onPrevious, 
  onComplete, 
  onNext 
}: LessonNavigationProps) {
  return (
    <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
      <button 
        onClick={onPrevious}
        className="flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-indigo-500 hover:text-indigo-600 transition-all"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Previous Lesson
      </button>
      
      <button 
        onClick={onComplete}
        className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
      >
        Mark as Complete
        <CheckCircleIcon className="h-5 w-5 ml-2" />
      </button>
      
      <button 
        onClick={onNext}
        className="flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-indigo-500 hover:text-indigo-600 transition-all"
      >
        Next Lesson
        <ArrowLeftIcon className="h-5 w-5 ml-2 rotate-180" />
      </button>
    </div>
  )
}