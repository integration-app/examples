import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

import { WORKSPACE_KEY, WORKSPACE_SECRET } from '@/lib/workspace'

type Params = {
  uuid: string
}

export async function GET(request: Request, { params }: { params: Params }) {
  const uuid = params.uuid

  const tokenData = { id: uuid }

  const options = {
    issuer: WORKSPACE_KEY,
    expiresIn: 7200,
  }

  const token = jwt.sign(tokenData, WORKSPACE_SECRET, options)

  return new NextResponse(JSON.stringify(token))
}
