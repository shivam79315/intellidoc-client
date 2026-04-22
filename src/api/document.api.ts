// src/api/document.api.ts

import api from '@/lib/axios'

export const uploadDocument = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

export const uploadChatDocument = async (
  chatId: string,
  file: File
) => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post(
    `/chats/${chatId}/documents`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return data
}

export const getDocuments = async () => {
  const { data } = await api.get('/documents')
  return data
}

export const getDocument = async (documentId: string) => {
  const { data } = await api.get(`/documents/${documentId}`)
  return data
}

export const deleteDocument = async (documentId: string) => {
  const { data } = await api.delete(`/documents/${documentId}`)
  return data
}