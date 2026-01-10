// components/quiz/QuizCard.tsx
interface QuizCardProps {
  quiz: {
    id: string
    title: string
    description?: string
    question_count: number
    passing_score: number
    time_limit?: number | null
    max_attempts: number
  }
  onStart: () => void
}

export function QuizCard({ quiz, onStart }: QuizCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 mb-1">{quiz.title}</h3>
          {quiz.description && (
            <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
          )}
        </div>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
          Quiz
        </span>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <span className="font-medium mr-1">{quiz.question_count}</span>
          <span>Questions</span>
        </div>
        
        <div className="flex items-center">
          <span className="font-medium mr-1">{quiz.passing_score}%</span>
          <span>Passing Score</span>
        </div>
        
        {quiz.time_limit && (
          <div className="flex items-center">
            <span className="font-medium mr-1">{quiz.time_limit}</span>
            <span>min</span>
          </div>
        )}
      </div>

      <button
        onClick={onStart}
        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        Start Quiz
      </button>
    </div>
  )
}