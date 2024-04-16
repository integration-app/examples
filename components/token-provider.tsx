'use client'

import React, { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import { useLocalStorage } from '@/lib/hooks/use-local-storage'

export const TokenContext = React.createContext('')

export default function TokenProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [token, setToken] = useLocalStorage<string>('token', '')

  useEffect(() => {
    if (!localStorage.getItem('uuid')) localStorage.setItem('uuid', uuidv4())

    async function refreshToken() {
      const uuid = localStorage.getItem('uuid')
      const res = await fetch(`/integration-token/${uuid}`)

      if (res.ok) {
        const token = await res.json()
        localStorage.setItem('token', token.toString())
        setToken(token)
      }
    }

    function needRefresh(token: string): Boolean {
      const tokenData = jwt.decode(token) as jwt.JwtPayload
      if (tokenData === null || tokenData.exp === undefined) {
        return true
      } else {
        return tokenData.exp < Date.now()
      }
    }

    if (needRefresh(token)) refreshToken()
  }, [])

  return <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
}
