// components/ui/LoadingSpinner.tsx
'use client'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ message, size = 'md' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-8 w-8 border-t-2 border-b-2',
    md: 'h-16 w-16 border-t-4 border-b-4',
    lg: 'h-24 w-24 border-t-6 border-b-6'
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center">
        <div className={`animate-spin rounded-full ${sizes[size]} border-indigo-600 mx-auto mb-4`}></div>
        {message && (
          <p className="text-gray-600">{message}</p>
        )}
      </div>
    </div>
  )
}