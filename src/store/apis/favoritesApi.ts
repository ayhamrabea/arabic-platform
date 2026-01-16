// store/apis/favoritesApi.ts
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '@/lib/supabaseClient'
import type { Vocabulary, GrammarRule } from './lessonsApi/types'
import { updateStreak } from '@/utils/services/streak'

interface Sentence {
  id: string
  text: string
  translation: string
  context?: string
  lesson_id: string
  audio_url?: string
  favorite_id: string
  created_at: string
}

interface VocabularyWithFavorite extends Vocabulary {
  favorite_id: string
  lesson_level?: string // إضافة المستوى من الدرس
}

interface GrammarRuleWithFavorite extends GrammarRule {
  favorite_id: string
  lesson_level?: string // إضافة المستوى من الدرس
}

interface FavoritesResponse {
  words: VocabularyWithFavorite[]
  grammar: GrammarRuleWithFavorite[]
  sentences: Sentence[]
}

interface ToggleFavoritePayload {
  itemId: string
  itemType: 'word' | 'grammar' | 'sentence'
}

export const favoritesApi = createApi({
  reducerPath: 'favoritesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Favorite'],
  endpoints: (builder) => ({
    getFavoriteItems: builder.query<FavoritesResponse, void>({
      async queryFn() {
        try {
          const user = (await supabase.auth.getUser()).data.user
          if (!user) {
            return { data: { words: [], grammar: [], sentences: [] } }
          }

          // جلب جميع المفضلة للمستخدم
          const { data: favorites, error: favoritesError } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (favoritesError) throw favoritesError

          if (!favorites || favorites.length === 0) {
            return { data: { words: [], grammar: [], sentences: [] } }
          }

          // فصل العناصر حسب النوع
          const wordFavorites = favorites.filter(f => f.item_type === 'word')
          const grammarFavorites = favorites.filter(f => f.item_type === 'grammar')
          const sentenceFavorites = favorites.filter(f => f.item_type === 'sentence')

          // جلب تفاصيل الكلمات المفضلة مع مستواها من الدرس
          let words: VocabularyWithFavorite[] = []
          if (wordFavorites.length > 0) {
            const wordIds = wordFavorites.map(f => f.item_id)
            const { data: wordsData, error: wordsError } = await supabase
              .from('vocabulary')
              .select(`
                *,
                lessons (
                  level
                )
              `)
              .in('id', wordIds)

            if (!wordsError && wordsData) {
              words = wordsData.map(word => {
                const favorite = wordFavorites.find(f => f.item_id === word.id)
                const lesson = word.lessons as any
                return {
                  ...word,
                  favorite_id: favorite?.id || '',
                  lesson_level: lesson?.level // المستوى من الدرس
                }
              })
            }
          }
            updateStreak(user.id).catch(console.error)
          // جلب تفاصيل القواعد المفضلة مع مستواها من الدرس
          let grammar: GrammarRuleWithFavorite[] = []
          if (grammarFavorites.length > 0) {
            const grammarIds = grammarFavorites.map(f => f.item_id)
            const { data: grammarData, error: grammarError } = await supabase
              .from('grammar_rules')
              .select(`
                *,
                lessons (
                  level
                )
              `)
              .in('id', grammarIds)

            if (!grammarError && grammarData) {
              grammar = grammarData.map(rule => {
                const favorite = grammarFavorites.find(f => f.item_id === rule.id)
                const lesson = rule.lessons as any
                return {
                  ...rule,
                  favorite_id: favorite?.id || '',
                  lesson_level: lesson?.level // المستوى من الدرس
                }
              })
            }
          }

          // جلب تفاصيل الجمل المفضلة (اختياري)
          let sentences: Sentence[] = []
          if (sentenceFavorites.length > 0) {
            const sentenceIds = sentenceFavorites.map(f => f.item_id)
            // يمكنك تعديل هذا بناءً على جدول الجمل لديك
            // هذا مجرد مثال
            const { data: sentencesData, error: sentencesError } = await supabase
              .from('sentences')
              .select('*')
              .in('id', sentenceIds)

            if (!sentencesError && sentencesData) {
              sentences = sentencesData.map(sentence => {
                const favorite = sentenceFavorites.find(f => f.item_id === sentence.id)
                return {
                  ...sentence,
                  favorite_id: favorite?.id || ''
                }
              })
            }
          }

          return {
            data: {
              words,
              grammar,
              sentences
            }
          }

        } catch (error: any) {
          console.error('Error fetching favorites:', error)
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message
            }
          }
        }
      },
      providesTags: ['Favorite']
    }),

    toggleFavorite: builder.mutation<boolean, ToggleFavoritePayload>({
      async queryFn({ itemId, itemType }) {
        try {
          const user = (await supabase.auth.getUser()).data.user
          if (!user) return { error: 'Not authenticated' as any }

          const { data: existing } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('item_id', itemId)
            .eq('item_type', itemType)
            .single()

          if (existing) {
            await supabase
              .from('favorites')
              .delete()
              .eq('id', existing.id)
            return { data: false }
          }

          await supabase
            .from('favorites')
            .insert({
              user_id: user.id,
              item_id: itemId,
              item_type: itemType,
            })

          return { data: true }

        } catch (error: any) {
          console.error('Error toggling favorite:', error)
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message
            }
          }
        }
      },
      invalidatesTags: ['Favorite']
    }),

    clearAllFavorites: builder.mutation<void, void>({
      async queryFn() {
        try {
          const user = (await supabase.auth.getUser()).data.user
          if (!user) return { error: 'Not authenticated' as any }

          await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)

          return { data: undefined }

        } catch (error: any) {
          console.error('Error clearing favorites:', error)
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message
            }
          }
        }
      },
      invalidatesTags: ['Favorite']
    }),
  }),
})

export const {
  useGetFavoriteItemsQuery,
  useToggleFavoriteMutation,
  useClearAllFavoritesMutation,
} = favoritesApi