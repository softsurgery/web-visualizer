import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './admin/importMap.js'
import '@payloadcms/next/css'
import '@/payload.css'
import PayloadThemeBridge from '@/components/payload/PayloadThemeBridge'

type Args = {
  children: React.ReactNode
}

const serverFunction = async (args: any) => {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    <PayloadThemeBridge />
    {children}
  </RootLayout>
)

export default Layout
