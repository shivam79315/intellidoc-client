import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { loginUser, registerUser, logoutUser } from '@/api/auth.api'
import { useAuthStore } from '@/store/authStore'

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