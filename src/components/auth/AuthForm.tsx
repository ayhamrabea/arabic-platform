'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDispatch } from 'react-redux'

import {
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'


import {
  useSignInMutation,
  useSignUpMutation,
} from '@/store/services/authApi'

import { setUser } from '@/store/slices/authSlice'
import { supabase } from '@/lib/supabaseClient'
import { AuthHeader } from './AuthHeader'
import { InputField } from '../form/InputField'
import { ErrorMessage } from '../ui/ErrorMessage'
import { SubmitButton } from '../form/SubmitButton'
import { FormDivider } from '../ui/FormDivider'
import { SocialLoginButton } from './SocialLoginButton'

interface AuthFormProps {
  type: 'login' | 'register'
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter()
  const dispatch = useDispatch()

  const [signIn] = useSignInMutation()
  const [signUp] = useSignUpMutation()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.email || !formData.password) {
      setError('Please fill all required fields')
      setLoading(false)
      return
    }

    if (type === 'register' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      if (type === 'login') {
        const res = await signIn({
          email: formData.email,
          password: formData.password,
        })

        if ('error' in res) throw res.error

        dispatch(setUser(res.data!))
        router.push('/dashboard')
        router.refresh()
      } else {
        const res = await signUp({
          email: formData.email,
          password: formData.password,
        })

        if ('error' in res) throw res.error

        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error')
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/callback`,
        },
      })

      if (error) throw error
    } catch (err: any) {
      setError(err?.message || 'Google login error')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AuthHeader type={type} />

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Email Address"
              icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <InputField
              label="Password"
              icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              showPasswordToggle
              isPasswordVisible={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {type === 'register' && (
              <InputField
                label="Confirm Password"
                icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            )}

            {error && <ErrorMessage message={error} />}

            <SubmitButton loading={loading} type={type} />

            <FormDivider />

            <SocialLoginButton
              provider="google"
              onClick={handleGoogleLogin}
              loading={loading}
            />

          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {type === 'login'
                ? "Don't have an account?"
                : 'Already have an account?'}

              <Link
                href={type === 'login' ? '/register' : '/login'}
                className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {type === 'login' ? 'Sign up' : 'Sign in'}
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
