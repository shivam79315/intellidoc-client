'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'

import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/hooks/useAuth'
import {
  useUploadDocument,
  useDocuments,
  useDeleteDocument,
} from '@/hooks/useDocument'

export default function DashboardPage() {
  const router = useRouter()

  const user = useAuthStore((state) => state.user)
  const isAuthLoading = useAuthStore((state) => state.isLoading)

  const logout = useLogout()
  const upload = useUploadDocument()
  const deleteDoc = useDeleteDocument()

  const {
    data: documents = [],
    isLoading: docsLoading,
    isFetching,
    refetch,
  } = useDocuments()

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/')
    }
  }, [user, isAuthLoading, router])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        [],
    },
    onDrop: (files) => {
      if (!files[0]) return

      upload.mutate(files[0], {
        onSuccess: () => refetch(),
      })
    },
  })

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const handleDelete = (documentId: string) => {
    setDeletingId(documentId)

    deleteDoc.mutate(documentId, {
      onSettled: () => {
        setDeletingId(null)
      },
    })
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <span className="font-semibold text-gray-900">Intellidocs</span>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.name}</span>

          <button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50"
          >
            {logout.isPending ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {/* Upload */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Upload Document
        </h1>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer mb-8 transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />

          <p className="text-gray-500 text-sm">
            {upload.isPending
              ? 'Uploading document...'
              : 'Drop PDF or DOCX here, or click to browse'}
          </p>
        </div>

        {/* Documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Documents
            </h2>

            {isFetching && (
              <span className="text-xs text-gray-400">Refreshing...</span>
            )}
          </div>

          {docsLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No documents uploaded yet.
            </p>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc: any) => (
                <div
                  key={doc._id}
                  className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {doc.originalName}
                    </p>

                    <div className="mt-2">
                      {doc.status === 'ready' && (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          Ready
                        </span>
                      )}

                      {doc.status === 'pending' && (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                          Pending
                        </span>
                      )}

                      {doc.status === 'processing' && (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          Processing
                        </span>
                      )}

                      {doc.status === 'failed' && (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-white text-red-600 border border-red-500">
                          Failed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.status === 'ready' && (
                      <Link
                        href={`/chat/${doc._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                      >
                        Chat
                      </Link>
                    )}

                    {(doc.status === 'pending' || doc.status === 'processing') && (
                      <span className="px-4 py-2 rounded-lg text-sm border border-gray-200 text-gray-400">
                        Please wait
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(doc._id)}
                      disabled={deletingId === doc._id}
                      className="px-4 py-2 rounded-lg text-sm border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === doc._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}