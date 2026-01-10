// components/lessons/ProgressPanel.tsx
import CircularProgress from '@/components/circularProgress/CircularProgress'

interface ProgressPanelProps {
  progress: number
  completed: number
  total: number
}

export function ProgressPanel({ 
  progress, 
  completed, 
  total 
}: ProgressPanelProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
      <h3 className="font-bold text-gray-900 mb-4">Lesson Progress</h3>
      <div className="text-center mb-4">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24">
            <CircularProgress progress={progress} />
          </div>
          <span className="absolute text-2xl font-bold text-gray-900">{progress}%</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 text-center">
        {completed} of {total} items completed
      </p>
    </div>
  )
}