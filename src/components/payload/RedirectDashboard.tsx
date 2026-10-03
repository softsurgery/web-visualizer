'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const RedirectDashboard = () => {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/')
  }, [router])
  
  return null
}
