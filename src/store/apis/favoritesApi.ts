import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '@/lib/supabaseClient'

interface ToggleFavoritePayload {
  itemId: string
  itemType: 'word' | 'grammar' | 'sentence'
}

export const favoritesApi = createApi({
  reducerPath: 'favoritesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Favorites'],
  endpoints: (builder) => ({
    toggleFavorite: builder.mutation<boolean, ToggleFavoritePayload>({
      async queryFn({ itemId, itemType }) {
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
          await supabase.from('favorites').delete().eq('id', existing.id)
          return { data: false }
        }

        await supabase.from('favorites').insert({
          user_id: user.id,
          item_id: itemId,
          item_type: itemType,
        })

        return { data: true }
      },
      invalidatesTags: ['Favorites'],
    }),
  }),
})

export const {
  useToggleFavoriteMutation
} = favoritesApi
