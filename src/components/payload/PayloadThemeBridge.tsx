'use client'

import { useTheme } from 'next-themes'
import React from 'react'

export default function PayloadThemeBridge() {
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const html = document.documentElement

    const observer = new MutationObserver(() => {
      const theme = html.getAttribute('data-theme')
      if (theme) setTheme(theme)
    })

    observer.observe(html, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [setTheme])

  return null
}
