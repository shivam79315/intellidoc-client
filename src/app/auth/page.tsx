'use client'
import { useState } from 'react'
import { useLogin, useRegister } from '@/hooks/useAuth'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const login = useLogin()
  const register = useRegister()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      login.mutate({ email: form.email, password: form.password })
    } else {
      register.mutate({ name: form.name, email: form.email, password: form.password })
    }
  }

  const isLoading = login.isPending || register.isPending
  const error = login.error?.message || register.error?.message

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
            <span className="text-white text-lg">D</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Intellidocs</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          {['Login', 'Register'].map((tab, i) => (
            <button
              key={tab}
              onClick={() => setIsLogin(i === 0)}
              className={`flex-1 py-2 text-sm rounded-full font-medium transition-all ${
                (isLogin && i === 0) || (!isLogin && i === 1)
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <input
              name="name"
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}