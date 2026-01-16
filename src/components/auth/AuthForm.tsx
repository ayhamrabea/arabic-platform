'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('Auth')

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
      setError(t('validation.requiredFields'))
      setLoading(false)
      return
    }

    if (type === 'register' && formData.password !== formData.confirmPassword) {
      setError(t('validation.passwordMismatch'))
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError(t('validation.passwordLength'))
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
      setError(err?.message || t('errors.authError'))
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
      setError(err?.message || t('errors.googleError'))
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

  const isLogin = type === 'login'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AuthHeader type={type} />

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label={t('form.email')}
              icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
              name="email"
              type="email"
              placeholder={t('form.emailPlaceholder')}
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <InputField
              label={t('form.password')}
              icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t('form.passwordPlaceholder')}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              showPasswordToggle
              isPasswordVisible={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />

            {!isLogin && (
              <InputField
                label={t('form.confirmPassword')}
                icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder={t('form.confirmPasswordPlaceholder')}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            )}

            {error && <ErrorMessage messageKey={error} />}

            <SubmitButton 
              loading={loading} 
              type={type}
              label={isLogin ? t('buttons.signIn') : t('buttons.signUp')}
              loadingLabel={isLogin ? t('buttons.signingIn') : t('buttons.signingUp')}
            />

            <FormDivider text={t('divider.text')} />

            <SocialLoginButton
              provider="google"
              onClick={handleGoogleLogin}
              loading={loading}
              label={t('buttons.googleSignIn')}
            />

          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? t('switch.registerPrompt') : t('switch.loginPrompt')}

              <Link
                href={isLogin ? '/register' : '/login'}
                className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {isLogin ? t('switch.register') : t('switch.login')}
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          {t('terms')}
        </p>
      </div>
    </div>
  )
}