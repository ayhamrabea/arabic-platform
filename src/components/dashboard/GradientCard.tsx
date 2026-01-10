// components/dashboard/GradientCard.tsx
import Link from 'next/link'
import Icon from '@/components/icon/Icon'

interface GradientCardProps {
  title: string
  description: string
  iconName: string
  href: string
  gradientFrom: string
  gradientTo: string
}

export function GradientCard({ 
  title, 
  description, 
  iconName, 
  href, 
  gradientFrom, 
  gradientTo 
}: GradientCardProps) {
  return (
    <Link 
      href={href} 
      className="bg-gradient-to-r hover:shadow-xl transition-all duration-300 rounded-xl p-6 text-white hover:scale-[1.02]"
      style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }}
    >
      <div className="flex items-center mb-4">
        <div className="p-3 bg-white/20 rounded-lg mr-4">
          <Icon className="h-8 w-8" name={iconName} />
        </div>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-purple-100 text-sm">{description}</p>
        </div>
      </div>
      <p className="text-sm mt-4">Try interactive speaking practice</p>
    </Link>
  )
}