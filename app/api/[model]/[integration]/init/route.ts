import { NextResponse } from 'next/server'
import { DataRecord, IntegrationAppClient } from '@integration-app/sdk'

import dbCollection from '@/lib/mongodb'
import { getSelf, verifyToken, handleError } from '@/app/api/utils'
import type { Params } from '../route'

export async function POST(request: Request, { params }: { params: Params }) {
  const { model, integration } = params

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
      const integrationApp = new IntegrationAppClient({ token: token })

      const flowRun = await integrationApp
        .flowInstance({
          flowKey: 'continuous-import-of-records-to-my-app',
          integrationKey: integration,
          // autoCreate: true,
        })
        .run({
          input: {
            model: 'files',
          },
        })
      const output = await integrationApp
        .flowRun(flowRun.id)
        .getOutput({ nodeKey: 'list-records' })
      const records = output.items.map((record: DataRecord) => {
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
