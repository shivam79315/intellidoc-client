import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createChat,
  getChats,
  getChat,
  getChatDocuments,
  sendMessage,
  deleteChat,
  SendMessageResponse,
} from '@/api/chats.api'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export const useCreateChat = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ documentIds, title }: { documentIds: string[]; title: string }) =>
      createChat(documentIds, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

export const useStartChat = () => {
  const router = useRouter()

  const user = useAuthStore(
    (state) => state.user
  )

  const isInitialized =
    useAuthStore(
      (state) =>
        state.isInitialized
    )

  const createChat =
    useCreateChat()

  const startChat =
    async () => {
      if (!isInitialized)
        return

      if (!user) {
        router.push('/auth')
        return
      }

      const res =
        await createChat.mutateAsync(
          {
            documentIds: [],
            title:
              'New Chat',
          }
        )

      router.push(
        `/chat/${res.data._id}`
      )
    }

  return {
    startChat,
    isPending:
      createChat.isPending,
    isInitialized,
    user,
  }
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

export const useChatDocuments = (
  chatId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ['chat-documents', chatId],
    queryFn: () => getChatDocuments(chatId),
    enabled: !!chatId && enabled,
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
