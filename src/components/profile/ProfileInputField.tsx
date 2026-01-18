// components/profile/ProfileInputField.tsx
import React from 'react'
import Icon from '../icon/Icon'

interface ProfileInputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
  previewImage?: boolean
}

export const ProfileInputField: React.FC<ProfileInputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  previewImage = false
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
      />
      {previewImage && value && value !== '/default-avatar.png' && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <img
            src={value}
            alt="preview"
            className="w-16 h-16 rounded-full object-cover border"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-avatar.png'
            }}
          />
        </div>
      )}
    </div>
  )
}
