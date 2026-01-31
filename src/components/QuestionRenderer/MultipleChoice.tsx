'use client'

interface Props {
  options: string[]
  selectedAnswer: string
  onSelect: (value: string) => void
}

export default function MultipleChoice({
  options,
  selectedAnswer,
  onSelect
}: Props) {
  return (
    <div className="space-y-4 mb-8">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          className={`
            w-full text-left p-4 rounded-xl border-2 transition-all
            ${selectedAnswer === option
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center mr-4
              ${selectedAnswer === option
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 text-gray-700'
              }
            `}>
              {String.fromCharCode(65 + index)}
            </div>
            <span className="text-lg">{option}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
