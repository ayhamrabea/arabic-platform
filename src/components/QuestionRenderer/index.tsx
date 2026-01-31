'use client'

import { Question } from '@/types/quiz'
import FillBlank from './FillBlank'
import MultipleChoice from './MultipleChoice'
import TrueFalse from './TrueFalse'

interface Props {
  question: Question
  selectedAnswer: string
  onAnswerChange: (value: string) => void
}

export default function QuestionRenderer({
  question,
  selectedAnswer,
  onAnswerChange
}: Props) {
  const renderQuestion = () => {
    switch (question.question_type) {
      case 'multiple_choice':
        return (
          <MultipleChoice
            options={Array.isArray(question.options) ? question.options : []}
            selectedAnswer={selectedAnswer}
            onSelect={onAnswerChange}
          />
        )

      case 'true_false':
        return (
          <TrueFalse
            selectedAnswer={selectedAnswer}
            onSelect={onAnswerChange}
          />
        )

      case 'fill_blank':
        return (
          <FillBlank
            value={selectedAnswer}
            onChange={onAnswerChange}
          />
        )


      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">
              نوع السؤال غير مدعوم: {question.question_type}
            </p>
          </div>
        )
    }
  }

  return (
    <div className="question-renderer">
      {renderQuestion()}
    </div>
  )
}