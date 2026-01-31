'use client'

const OPTIONS = ['صحيح', 'خَطَأ']

interface Props {
  selectedAnswer: string
  onSelect: (value: string) => void
}

export default function TrueFalse({ selectedAnswer, onSelect }: Props) {
  return (
    <div className="space-y-4 mb-8">
      {OPTIONS.map((option, index) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`
            w-full p-4 rounded-xl border-2 transition-all
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
              {index === 0 ? 'T' : 'F'}
            </div>
            <span className="text-lg">{option}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
