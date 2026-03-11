export const dynamic = 'force-dynamic'
import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'Lora, serif' }}>
          Join Bechne
        </h1>
        <p className="text-stone-500 text-sm">Create your free account and start buying or selling</p>
      </div>
      <SignupForm />
      <p className="text-center text-sm text-stone-500 mt-6">
        Already have an account?{' '}
        <a href="/login" className="text-amber-800 font-semibold hover:underline">
          Login
        </a>
      </p>
    </>
  )
}