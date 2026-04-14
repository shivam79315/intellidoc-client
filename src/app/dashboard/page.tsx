'use client'

import { useDropzone } from 'react-dropzone'
import { useLogout } from '@/hooks/useAuth'
import { useUploadDocument } from '@/hooks/useDocument'

export default function DashboardPage() {
  const logout = useLogout()
  const upload = useUploadDocument()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
    },

    onDrop: async (files) => {
      if (!files[0]) return
      upload.mutate(files[0])
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <span className="font-semibold text-gray-900">Intellidocs</span>

        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50"
        >
          {logout.isPending ? 'Logging out...' : 'Logout'}
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
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
              ? 'Uploading...'
              : 'Drop PDF or DOCX here, or click to browse'}
          </p>
        </div>

        {upload.isSuccess && (
          <p className="text-sm text-green-600 bg-green-50 px-4 py-3 rounded-xl">
            Document uploaded successfully.
          </p>
        )}

        {upload.isError && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
            Upload failed. Please try again.
          </p>
        )}

        {/*
        Future Section:

        - useDocuments()
        - uploaded document list
        - delete document
        - processing status
        - chat button
        */}
      </div>
    </div>
  )
}