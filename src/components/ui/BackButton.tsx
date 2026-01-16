'use client'

import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

interface BackButtonProps {
  href: string
  textKey?: string // المفتاح في messages
  className?: string
}

export function BackButton({ 
  href, 
  textKey = 'back', // القيمة الافتراضية للمفتاح
  className = ''
}: BackButtonProps) {
  const t = useTranslations('General') // مثلاً في messages/General.json

  return (
    <div className={`mb-6 ${className}`}>
      <Link 
        href={href} 
        className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        {t(textKey)}
      </Link>
    </div>
  )
}
