// components/dashboard/QuickActionCard.tsx
import Link from 'next/link'

interface QuickActionCardProps {
  title: string
  description: string
  emoji: string
  href: string
  gradientFrom: string
  gradientTo: string
}

export function QuickActionCard({ 
  title, 
  description, 
  emoji, 
  href, 
  gradientFrom, 
  gradientTo 
}: QuickActionCardProps) {
  return (
    <Link 
      href={href} 
      className="flex items-center p-4 bg-gradient-to-r rounded-lg hover:shadow-md transition-all"
      style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }}
    >
      <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
        <span className="text-2xl">{emoji}</span>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  )
}