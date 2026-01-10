// components/dashboard/StatCard.tsx
import Link from 'next/link'

interface StatCardProps {
  title: string
  description: string
  value?: string
  percentage?: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'yellow' | 'purple'
  href?: string
  progress?: number
  showProgress?: boolean
}

export function StatCard({ 
  title, 
  description, 
  value, 
  percentage, 
  icon, 
  color, 
  href,
  progress,
  showProgress = false 
}: StatCardProps) {
  const colors = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-300' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' }
  }

  const content = (
    <div className="bg-white group hover:shadow-xl transition-all duration-300 rounded-xl p-6 border border-gray-200 hover:border-indigo-300 hover:scale-[1.02]">
      <div className="flex items-center mb-4">
        <div className={`p-3 ${colors[color].bg} rounded-lg mr-4 group-hover:${colors[color].bg.replace('100', '200')} transition-colors`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
      
      {showProgress && progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`${colors[color].bg.replace('100', '600')} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{progress}% completed</p>
        </div>
      )}
      
      {value && <p className="text-2xl font-bold text-gray-900">{value}</p>}
      {percentage !== undefined && <p className="text-sm font-semibold mt-1">{percentage}%</p>}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  
  return content
}