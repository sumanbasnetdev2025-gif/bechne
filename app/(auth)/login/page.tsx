export const dynamic = 'force-dynamic'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'Lora, serif' }}>
          Welcome back
        </h1>
        <p className="text-stone-500 text-sm">Login to your Bechne account</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-stone-500 mt-6">
        Don't have an account?{' '}
        <a href="/signup" className="text-amber-800 font-semibold hover:underline">
          Sign up free
        </a>
      </p>
    </>
  )
}