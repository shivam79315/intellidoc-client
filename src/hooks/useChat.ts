import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createChat,
  getChats,
  getChat,
  sendMessage,
  deleteChat,
  IChat,
  CreateChatResponse,
  SendMessageResponse,
} from '@/api/chats.api'

export const useCreateChat = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ documentId, title }: { documentId: string; title: string }) =>
      createChat(documentId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

export const useChats = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: () => getChats(),
  })
}

export const useChat = (chatId: string) => {
  return useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => getChat(chatId),
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ chatId, message }: { chatId: string; message: string }) =>
      sendMessage(chatId, message),
    onSuccess: (data: SendMessageResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['chat', variables.chatId],
      })
    },
  })
}

export const useDeleteChat = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (chatId: string) => deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}