'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export default function AuthInitializer() {
  const fetchUser = useAuthStore((s) => s.fetchUser)
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const isInitialized = useAuthStore((s) => s.isInitialized)

  useEffect(() => {
    if (!hasHydrated || isInitialized) return

    fetchUser()
  }, [fetchUser, hasHydrated, isInitialized])

  return null
}
