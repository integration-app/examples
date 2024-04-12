'use client'

import React, { useEffect, useState } from 'react'

import handleToken from '@/lib/token'

export const TokenContext = React.createContext('')

export default function TokenProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    handleToken().then((token) => setToken(token as string))
  }, [])

  return <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
}
