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
  isInitialized: boolean
  hasHydrated: boolean
  setAuth: (user: User) => void
  logout: () => void
  setHasHydrated: (hasHydrated: boolean) => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isInitialized: false,
      hasHydrated: false,

      setAuth: (user) =>
        set({
          user,
          isLoading: false,
          isInitialized: true,
        }),

      logout: () =>
        set({
          user: null,
          isLoading: false,
          isInitialized: true,
        }),

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      fetchUser: async () => {
        if (typeof window === 'undefined') return

        const token = localStorage.getItem('token')

        if (!token) {
          set({
            user: null,
            isLoading: false,
            isInitialized: true,
          })
          return
        }

        try {
          set({ isLoading: true })

          const data = await getMe()

          set({
            user: data.user,
            isLoading: false,
            isInitialized: true,
          })
        } catch {
          localStorage.removeItem('token')

          set({
            user: null,
            isLoading: false,
            isInitialized: true,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
