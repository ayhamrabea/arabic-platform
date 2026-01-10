import AuthForm from '@/components/auth/AuthForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - AI Platform',
  description: 'Create a new AI Platform account',
}

export default function RegisterPage() {
  return <AuthForm type="register" />
}