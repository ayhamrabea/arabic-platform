import AuthForm from '@/components/auth/AuthForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - AI Platform',
  description: 'Sign in to your AI Platform account',
}

export default function LoginPage() {
  return <AuthForm type="login" />
}