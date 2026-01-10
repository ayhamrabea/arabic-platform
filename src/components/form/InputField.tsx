// components/form/InputField.tsx
import { forwardRef } from 'react'
import Icon from '../icon/Icon'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: React.ReactNode
  type?: string
  showPasswordToggle?: boolean
  onTogglePassword?: () => void
  isPasswordVisible?: boolean
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, icon, type = 'text', showPasswordToggle = false, onTogglePassword, isPasswordVisible, className = '', ...props }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type={type === 'password' && isPasswordVisible ? 'text' : type}
            className={`${icon ? 'pl-10' : 'pl-4'} ${showPasswordToggle ? 'pr-10' : 'pr-4'} w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${className}`}
            {...props}
          />
          
          {showPasswordToggle && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <Icon 
                className="h-5 w-5 text-gray-400" 
                name={isPasswordVisible ? 'hidePassword' : 'showPassword'} 
              />
            </button>
          )}
        </div>
      </div>
    )
  }
)

// أضف هذه السطر ⬇️
InputField.displayName = 'InputField'