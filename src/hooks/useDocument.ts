import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
} from '@/api/document.api'

export const useUploadDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadDocument(file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      })
    },
  })
}

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => getDocuments(),
  })
}

export const useDocument = (documentId: string) => {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: () => getDocument(documentId),
  })
}

export const useDeleteDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      })
    },
  })
}