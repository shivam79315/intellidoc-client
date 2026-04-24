import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  uploadDocument,
  uploadChatDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  UploadChatDocumentResponse,
} from '@/api/document.api'

export const useUploadDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) =>
      uploadDocument(file),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      })
    },
  })
}

export const useUploadChatDocument = () => {
  const queryClient = useQueryClient()

  return useMutation<
    UploadChatDocumentResponse,
    Error,
    {
      chatId: string
      file: File
    }
  >({
    mutationFn: ({
      chatId,
      file,
    }) => uploadChatDocument(chatId, file),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['chat', variables.chatId],
      })

      queryClient.invalidateQueries({
        queryKey: ['chats'],
      })
    },
  })
}

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
  })
}

export const useDocument = (
  documentId: string
) => {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: () =>
      getDocument(documentId),
    enabled: !!documentId,
  })
}

export const useDeleteDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      documentId: string
    ) => deleteDocument(documentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      })
    },
  })
}