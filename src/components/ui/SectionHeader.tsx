// components/ui/SectionHeader.tsx
import Link from 'next/link'

interface SectionHeaderProps {
  title: string
  linkText?: string
  linkHref?: string
}

export function SectionHeader({ title, linkText, linkHref }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {linkText && linkHref && (
        <Link href={linkHref} className="text-indigo-600 hover:text-indigo-800 font-medium">
          {linkText} →
        </Link>
      )}
    </div>
  )
}