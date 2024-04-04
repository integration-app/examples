'use client'

import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

export default async function handleToken() {
  if (!localStorage.getItem('uuid')) localStorage.setItem('uuid', uuidv4())

  const token = localStorage.getItem('token')
  if (token === null || needRefresh(token)) {
    refreshToken()
  }
}

async function refreshToken() {
  const uuid = localStorage.getItem('uuid')
  const res = await fetch(`/integration-token/${uuid}`)

  if (res.ok) {
    const token = await res.json()
    localStorage.setItem('token', token.toString())
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
