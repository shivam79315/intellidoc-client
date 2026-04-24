'use client'

import Link from 'next/link'
import { useStartChat } from '@/hooks/useChat'

export default function Home() {

  const {
    startChat,
    isPending,
    isInitialized,
    user
  } = useStartChat()

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
            onClick={startChat}
            disabled={
              !isInitialized ||
              isPending
            }
            className="px-6 py-3 rounded-xl text-sm font-medium bg-blue-600 text-white cursor-pointer hover:bg-blue-700 disabled:bg-blue-300"
          >
            {!isInitialized
              ? 'Checking session...'
              : isPending
              ? 'Creating Chat...'
              : 'Create New Chat'}
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
