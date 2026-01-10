// components/lessons/LessonCard.tsx
import Link from 'next/link'
import { 
  AcademicCapIcon, 
  ClockIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  BookOpenIcon 
} from '@heroicons/react/24/outline'

interface LessonCardProps {
  lesson: {
    id: string
    title: string
    type: string
    level: string
    duration: number | null
    description?: string
  }
  progress?: number
}

export function LessonCard({ lesson, progress = 30 }: LessonCardProps) {
  const getLevelColor = (level: string) => {
    switch(level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'video': return <VideoCameraIcon className="h-5 w-5" />
      case 'audio': return <SpeakerWaveIcon className="h-5 w-5" />
      default: return <BookOpenIcon className="h-5 w-5" />
    }
  }

  return (
    <Link
      href={`/lessons/${lesson.id}`}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-[1.02]"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(lesson.level)}`}>
                {lesson.level}
              </span>
              <div className="flex items-center text-gray-500">
                {getTypeIcon(lesson.type)}
                <span className="ml-1 text-sm">{lesson.type}</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
              {lesson.title}
            </h2>
            {lesson.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>
            )}
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
            <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-gray-600">
            <ClockIcon className="h-5 w-5 mr-2" />
            <span className="text-sm">{lesson.duration || 15} min</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
              Start Lesson →
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs font-medium text-indigo-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </Link>
  )
}