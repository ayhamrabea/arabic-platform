import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

export function DownloadLessonButton({
  pdfPath,
  disabled = false,
  className = '',
}: {
  pdfPath?: string | null
  disabled?: boolean
  className?: string
}) {
  const t = useTranslations('LessonDetailPage')
  
  if (!pdfPath) return null

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/lesson-files/${pdfPath}`

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      download
      className={`
        ${className}
        inline-flex items-center justify-center gap-2
        px-4 py-3 rounded-lg font-medium
        transition-colors
        ${disabled
          ? 'bg-gray-300 text-gray-600 cursor-not-allowed pointer-events-none'
          : 'bg-blue-600 text-white hover:bg-blue-700'
        }
      `}
      aria-disabled={disabled}
    >
      <ArrowDownTrayIcon className="h-5 w-5" />
      <span className="whitespace-nowrap">
        {t('downloadPDF') || 'Download PDF'}
      </span>
    </a>
  )
}