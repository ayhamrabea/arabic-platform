// components/ui/CTACard.tsx
interface CTACardProps {
  title: string
  description: string
  buttonText: string
  onButtonClick?: () => void
  gradientFrom?: string
  gradientTo?: string
}

export function CTACard({ 
  title, 
  description, 
  buttonText, 
  onButtonClick,
  gradientFrom = '#4f46e5',
  gradientTo = '#9333ea'
}: CTACardProps) {
  return (
    <div 
      className="bg-gradient-to-r rounded-2xl p-8 text-white max-w-3xl mx-auto"
      style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }}
    >
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="mb-6 text-indigo-100">{description}</p>
      <button 
        onClick={onButtonClick}
        className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  )
}