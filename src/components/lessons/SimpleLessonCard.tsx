interface SimpleLessonCardProps {
  title: string
  duration: string
  level: string
  isActive?: boolean
  onStart?: () => void
}

export function SimpleLessonCard({ 
  title, 
  duration, 
  level, 
  isActive = false,
  onStart 
}: SimpleLessonCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              level === 'Beginner' 
                ? 'bg-green-100 text-green-800'
                : level === 'Intermediate'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {level}
            </span>
            {isActive && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                Active
              </span>
            )}
          </div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{duration}</p>
        </div>
        <button
          onClick={onStart}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isActive ? 'Continue' : 'Start'}
        </button>
      </div>
    </div>
  )
}