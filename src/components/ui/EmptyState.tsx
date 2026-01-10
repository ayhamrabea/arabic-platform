// components/ui/EmptyState.tsx
import { BookOpenIcon } from '@heroicons/react/24/outline'

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  message?: string
  action?: React.ReactNode
}

export function EmptyState({ 
  icon = <BookOpenIcon className="h-10 w-10 text-indigo-600" />,
  title = "No lessons available",
  message = "New lessons are coming soon!",
  action 
}: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {action}
    </div>
  )
}