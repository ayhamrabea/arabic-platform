// components/ui/ErrorMessage.tsx

import Icon from "../icon/Icon"

interface ErrorMessageProps {
  message: string
  type?: 'error' | 'warning' | 'success'
}

export function ErrorMessage({ message, type = 'error' }: ErrorMessageProps) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-600',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    success: 'bg-green-50 border-green-200 text-green-600'
  }

  const icons = {
    error: 'error',
    warning: 'warning',
    success: 'success'
  }

  return (
    <div className={`p-4 border rounded-lg flex items-start ${styles[type]}`}>
      <Icon className={`h-5 w-5 mr-2 mt-0.5 ${type === 'error' ? 'text-red-400' : type === 'warning' ? 'text-yellow-400' : 'text-green-400'}`} name={icons[type]} />
      <p className="text-sm">{message}</p>
    </div>
  )
}