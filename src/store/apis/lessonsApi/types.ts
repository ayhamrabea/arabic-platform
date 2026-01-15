// أنواع البيانات الأساسية
export interface Lesson {
  id: string
  title: string
  type: string
  level: string
  content: any
  duration: number | null
  video_url: string | null
  audio_url: string | null
  difficulty: string
  prerequisites: any[]
  order_index: number
  tags: string[]
  is_active: boolean
  estimated_xp: number
  created_at: string
  updated_at: string
}

export interface GrammarRule {
  id: string
  lesson_id: string
  rule_name: string
  examples: any
  exceptions: string | null
  explanation: string
  created_at: string
  updated_at: string
  isFavorite?: boolean;
}

export interface Vocabulary {
  id: string
  lesson_id: string
  word: string
  translation: string
  pronunciation: string | null
  example_sentence: string | null
  audio_url: string | null
  word_type: string | null
  difficulty_score: number
  created_at: string
  updated_at: string
  isFavorite?: boolean;
}

export interface StudentProgress {
  id: string
  profile_id: string
  lesson_id: string
  status: 'pending' | 'in_progress' | 'completed'
  score: number | null
  attempts: number
  is_favorite: boolean
  notes: string | null
  started_at: string
  completed_at: string | null
  completed_items: string[]
  created_at: string
  updated_at: string
}

export interface LessonWithProgress extends Lesson {
  progress?: StudentProgress
  vocabulary_count: number
  grammar_count: number
  total_items: number
}

export interface LessonDetailResponse {
  lesson: Lesson
  grammar: GrammarRule[]
  vocabulary: Vocabulary[]
  progress: StudentProgress | null
  total_items: number
}

export interface ProgressPercentage {
  lessonId: string
  percentage: number
  completed: number
  total: number
}

export interface LessonFilterParams {
  level?: string
  type?: string
}