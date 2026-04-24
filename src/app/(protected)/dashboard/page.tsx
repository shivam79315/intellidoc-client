'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/hooks/useAuth'
import { useChats, useDeleteChat } from '@/hooks/useChat'
import { useStartChat } from '@/hooks/useChat'
import { IChat } from '@/api/chats.api'

export default function DashboardPage() {
  const router = useRouter()

  const user = useAuthStore((state) => state.user)
  const isAuthLoading = useAuthStore((state) => state.isLoading)
  const isAuthInitialized = useAuthStore(
    (state) => state.isInitialized
  )

  const logout = useLogout()
  const deleteChat = useDeleteChat()

  const {
    startChat,
    isPending,
    isInitialized,
  } = useStartChat()

  const {
    data: chats,
    isLoading,
    isFetching,
  } = useChats()

  const [deletingId, setDeletingId] =
    useState<string | null>(null)

  useEffect(() => {
    if (
      isAuthInitialized &&
      !user
    ) {
      router.replace('/auth')
    }
  }, [
    user,
    isAuthInitialized,
    router,
  ])

  const handleDelete = (
    chatId: string
  ) => {
    setDeletingId(chatId)

    deleteChat.mutate(chatId, {
      onSuccess: () => {
        toast.success(
          'Chat deleted'
        )
      },

      onError: () => {
        toast.error(
          'Failed to delete chat'
        )
      },

      onSettled: () => {
        setDeletingId(null)
      },
    })
  }

  const formatDate = (
    value: string
  ) => {
    return new Date(
      value
    ).toLocaleDateString(
      undefined,
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  if (
    !isAuthInitialized ||
    isAuthLoading
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading dashboard...
        </p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="font-semibold text-gray-900"
        >
          Intellidocs
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user.name}
          </span>

          <button
            disabled={
              logout.isPending
            }
            onClick={() =>
              logout.mutate(
                undefined,
                {
                  onSuccess:
                    () => {
                      toast.success(
                        'Logged out'
                      )
                    },
                }
              )
            }
            className="text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50"
          >
            {logout.isPending
              ? 'Logging out...'
              : 'Logout'}
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {/* Create New Chat */}
        <div className="mb-10">
          <div className="flex justify-center gap-4 my-6">
              <button
                onClick={startChat}
                disabled={
                  !isInitialized ||
                  isPending
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer text-sm hover:bg-blue-700"
              >
                {!isInitialized
                  ? 'Checking session...'
                  : isPending
                  ? 'Creating Chat...'
                  : 'Create New Chat'}
              </button>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Or
            </span>

            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </div>

        {/* Chats */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Chats
            </h2>

            {isFetching && (
              <span className="text-xs text-gray-400">
                Refreshing...
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                )
              )}
            </div>
          ) : !chats?.data ||
            chats.data
              .length ===
              0 ? (
            <p className="text-sm text-gray-500">
              No chats yet.
              Create your first
              chat.
            </p>
          ) : (
            <div className="grid gap-4">
              {chats.data.map(
                (chat: IChat) => {
                  const lastMessage =
                    chat
                      .messages?.[
                      chat
                        .messages
                        .length -
                        1
                    ]
                      ?.content ||
                    'No messages yet'

                  return (
                    <div
                      key={
                        chat._id
                      }
                      className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {
                            chat.title
                          }
                        </p>

                        <p className="text-sm text-gray-500 mt-1 truncate max-w-xl">
                          {
                            lastMessage
                          }
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          {
                            chat
                              .documentIds
                              .length
                          }{' '}
                          docs • Updated{' '}
                          {formatDate(
                            chat.updatedAt
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/chat/${chat._id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                        >
                          Open
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(
                              chat._id
                            )
                          }
                          disabled={
                            deletingId ===
                            chat._id
                          }
                          className="px-4 py-2 rounded-lg text-sm border border-red-200 text-red-600 cursor-pointer hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId ===
                          chat._id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}