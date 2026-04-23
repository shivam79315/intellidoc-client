'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useCreateChat } from '@/hooks/useChat'

export default function Home() {
  const router = useRouter()

  const user = useAuthStore((state) => state.user)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  const createChatMutation = useCreateChat()

  const handleGetStarted = async () => {
    if (!isInitialized) return

    if (!user) {
      router.push('/auth')
      return
    }

    try {
      const res = await createChatMutation.mutateAsync({
        documentIds: [],
        title: 'New Chat',
      })

      const chatId = res.data._id
      router.push(`/chat/${chatId}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-xl">D</span>
        </div>

        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Intellidocs
        </h1>

        <p className="text-gray-500 text-lg mb-8">
          Upload documents and chat with them using AI.
          Get instant answers grounded in your content.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleGetStarted}
            disabled={!isInitialized || createChatMutation.isPending}
            className="px-6 py-3 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {!isInitialized
              ? 'Checking session...'
              : createChatMutation.isPending
              ? 'Creating Chat...'
              : 'Get Started'}
          </button>

          {isInitialized && !user && (
            <Link
              href="/auth"
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
