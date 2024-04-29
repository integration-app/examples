import { NextResponse } from 'next/server'

import dbCollection from '@/lib/mongodb'
import { getSelf, verifyToken, handleEvent, handleError } from '@/app/api/utils'

export type Params = {
  model: 'files'
  integration: string
}

export async function POST(request: Request, { params }: { params: Params }) {
  const { model } = params

  try {
    const { jwtPayload } = verifyToken(request)

    const userId = jwtPayload.sub as string
    const data = await request.json()
    const result = await handleEvent(userId, model, data)

    return NextResponse.json(result)
  } catch (error) {
    return handleError(error, 400)
  }
}

export async function GET(request: Request, { params }: { params: Params }) {
  const { integration, model } = params

  try {
    const { token } = verifyToken(request)
    // @ts-expect-error ts(2339)
    // Property 'internalId' does not exist on type 'Self'.
    // SDK is out of date
    const { internalId } = await getSelf(token)

    try {
      const collection = await dbCollection(model)
      const commonFields = {
        env: process.env.NODE_ENV,
        integrationKey: integration,
        userId: internalId,
      }
      const records = await collection.find(commonFields).toArray()

      return NextResponse.json({ records }, { status: 200 })
    } catch (error) {
      return handleError(error, 500)
    }
  } catch (error) {
    return handleError(error, 400)
  }
}
