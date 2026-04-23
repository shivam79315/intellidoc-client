'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const isInitialized = useAuthStore((s) => s.isInitialized)

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/auth')
    }
  }, [user, isInitialized, router])

  if (!isInitialized || isLoading) return <div>Loading...</div>

  return <>{children}</>
}
