import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { loginUser, registerUser, logoutUser, getMe, User } from '@/api/auth.api'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth)
  const router = useRouter()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.user)
      router.push('/dashboard')
    },
  })
}

export const useRegister = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      router.push('/auth')
    },
  })
}

export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.logout)
  const router = useRouter()

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearAuth()
      router.push('/auth')
    },
  })
}

export const useMe = () => {
  const setAuth = useAuthStore((s) => s.setAuth)

  const query = useQuery<{ user: User }>({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
  })

  useEffect(() => {
    if (query.data?.user) {
      setAuth(query.data.user)
    }
  }, [query.data, setAuth])

  return query
}