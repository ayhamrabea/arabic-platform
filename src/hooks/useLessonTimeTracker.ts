'use client'

import { useEffect } from 'react'
import { updateTimeSpent } from '@/store/slices/dashboardSlice'
import { useAppDispatch } from '@/store/hooks'

export const useLessonTimeTracker = (userId?: string) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!userId) return

    let start = Date.now()
    let accumulated = 0

    const saveTime = () => {
      accumulated += Date.now() - start
      const minutes = Math.floor(accumulated / 60000)

      if (minutes > 0) {
        dispatch(updateTimeSpent({ userId, minutes }) )
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveTime()
      } else {
        start = Date.now()
      }
    }

    const handleBeforeUnload = () => {
      saveTime()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      saveTime()
    }
  }, [userId, dispatch])
}
