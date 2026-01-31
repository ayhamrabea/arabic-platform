export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'


export interface Question {
  id: string
  question_text: string
  question_type: QuestionType
  options: string
  correct_answer: string
  explanation?: string
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
  order_index: number
  question_image_url?: string
  question_audio_url?: string
}
