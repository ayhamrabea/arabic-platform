'use client'

import { useEffect } from 'react'
import { useGetCurrentUserQuery } from '@/store/services/authApi'
import { useDispatch } from 'react-redux'
import { setUser, finishLoading } from '@/store/slices/authSlice'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const { data: user, isLoading } = useGetCurrentUserQuery(undefined)

  useEffect(() => {
    if (user) {
      dispatch(setUser(user))
    } else if (!isLoading) {
      dispatch(finishLoading())
    }
  }, [user, isLoading, dispatch])

  return <>{children}</>
}
