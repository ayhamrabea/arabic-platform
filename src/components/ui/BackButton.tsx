// components/ui/BackButton.tsx
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface BackButtonProps {
  href: string
  text?: string
  className?: string
}

export function BackButton({ 
  href, 
  text = "Back",
  className = ""
}: BackButtonProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <Link 
        href={href} 
        className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        {text}
      </Link>
    </div>
  )
}