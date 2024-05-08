import { NextResponse } from 'next/server'
import { DataRecord, IntegrationAppClient } from '@integration-app/sdk'

import dbCollection from '@/lib/mongodb'
import { getSelf, verifyToken, handleError } from '@/app/api/utils'
import type { Params } from '../route'

export async function POST(request: Request, { params }: { params: Params }) {
  const { model, integration } = params

  try {
    const { token } = verifyToken(request)
    const { internalId } = await getSelf(token)

    try {
      const collection = await dbCollection(model)
      const commonFields = {
        env: process.env.NODE_ENV,
        integrationKey: integration,
        userId: internalId,
      }
      const integrationApp = new IntegrationAppClient({ token: token })

      const flowRun = await integrationApp
        .flowInstance({
          flowKey: process.env.NEXT_PUBLIC_FILE_IMPORT_FLOW_KEY,
          integrationKey: integration,
          autoCreate: true,
        })
        .run({
          input: { model: model },
        })
      const outputs = await integrationApp
        .flowRun(flowRun.id)
        .getNodeOutputs('list-records')
      const records = outputs.items[0].map((record: DataRecord) => {
        return { ...record, ...commonFields, updatedAt: Date.now() }
      })

      collection.deleteMany(commonFields)
      collection.insertMany(records)

      return NextResponse.json({ records }, { status: 200 })
    } catch (error) {
      return handleError(error, 500)
    }
  } catch (error) {
    console.error(error)
    return handleError(error, 400)
  }
}
