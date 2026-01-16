'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log('Session:', data.session)
    })
  }, [])

  return (
    <main style={{ padding: 40 }}>
      <h1>AI Product</h1>
      <p>Supabase connected ✔</p>
    </main>
  )
}
