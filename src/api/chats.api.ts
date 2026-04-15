import api from '@/lib/axios'

export interface IMessage {
  role: 'user' | 'assistant'
  content: string
  relatedChunks?: string[]
}

export interface IChat {
  _id: string
  userId: string
  documentId: string
  title: string
  messages: IMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateChatResponse {
  data: IChat
}

export interface SendMessageResponse {
  data: IChat
}

export const createChat = async (
  documentId: string,
  title: string
): Promise<CreateChatResponse> => {
  const { data } = await api.post('/chats', { documentId, title })
  return data
}

export const getChats = async (): Promise<{ data: IChat[] }> => {
  const { data } = await api.get('/chats')
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