import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getMe } from '@/api/auth.api'

interface User {
  _id: string
  name: string
  email: string
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  setAuth: (user: User) => void
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      setAuth: (user) => set({ user }),

      logout: () => set({ user: null }),

      fetchUser: async () => {
        try {
          set({ isLoading: true })

          const data = await getMe()

          set({
            user: data.user,
            isLoading: false,
          })
        } catch {
          set({
            user: null,
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)