import api from '@/lib/axios'

export interface IMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  relatedChunks?: string[]

  type?: 'text' | 'document'

  document?: {
    _id: string
    originalName: string
    mimeType: string
    size: number
  }
}

export interface IChat {
  _id: string
  userId: string
  documentIds: string[]
  title: string
  messages: IMessage[]
  createdAt: string
  updatedAt: string
}

export interface IDocument {
  _id: string
  userId: string
  originalName: string
  fileName: string
  mimeType: string
  size: number
  status?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateChatResponse {
  data: IChat
}

export interface SendMessageResponse {
  data: IChat
}

export interface GetChatDocumentsResponse {
  data: IDocument[]
}

export const createChat = async (
  documentIds: string[],
  title: string
): Promise<CreateChatResponse> => {
  const { data } = await api.post('/chats', { documentIds, title })
  return data
}

export const getChats = async (): Promise<{ data: IChat[] }> => {
  const { data } = await api.get('/chats')
  return data
}

export const getChatDocuments = async (
  chatId: string
): Promise<GetChatDocumentsResponse> => {
  const { data } = await api.get(
    `/chats/${chatId}/documents`
  )

  return data
}

export const getChat = async (chatId: string): Promise<{ data: IChat }> => {
  const { data } = await api.get(`/chats/${chatId}`)
  return data
}

export const sendMessage = async (
  chatId: string,
  message: string
): Promise<SendMessageResponse> => {
  const { data } = await api.post(`/chats/${chatId}/message`, { message })
  return data
}

export const deleteChat = async (chatId: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/chats/${chatId}`)
  return data
}