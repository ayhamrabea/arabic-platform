'use client'

import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

interface FavoriteButtonProps {
  isFavorite?: boolean
  onClick: () => void

  /** UI */
  size?: 'sm' | 'md'
  variant?: 'toggle' | 'remove'
  stopPropagation?: boolean
  title?: string
}

export function FavoriteButton({
  isFavorite = false,
  onClick,
  size = 'md',
  variant = 'toggle',
  stopPropagation = true,
  title,
}: FavoriteButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation()
    onClick()
  }

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const padding = size === 'sm' ? 'p-1.5' : 'p-2'

  // حالة الحذف فقط
  if (variant === 'remove') {
    return (
      <button
        onClick={handleClick}
        title={title}
        className={`text-rose-500 hover:text-rose-700 transition-colors ${padding}`}
      >
        <HeartSolid className={iconSize} />
      </button>
    )
  }

  // حالة toggle
  return (
    <button
      onClick={handleClick}
      title={title}
      className={`rounded-full transition ${padding} ${
        isFavorite
          ? 'bg-red-100 hover:bg-red-200'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      {isFavorite ? (
        <HeartSolid className={`${iconSize} text-red-500`} />
      ) : (
        <HeartIcon className={`${iconSize} text-gray-500`} />
      )}
    </button>
  )
}
