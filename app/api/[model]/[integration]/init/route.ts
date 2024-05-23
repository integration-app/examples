import { NextResponse } from 'next/server'
import { DataRecord, IntegrationAppClient } from '@integration-app/sdk'

import dbCollection from '@/lib/mongodb'
import { getSelf, verifyToken, handleError } from '@/app/api/utils'
import type { Params } from '../route'

export const maxDuration = 60

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

      await collection.deleteMany(commonFields)

      const actionInstance = integrationApp.actionInstance({
        parentKey: 'get-all-drive-items',
        integrationKey: integration,
        autoCreate: true,
      })

      let records: DataRecord[] = []
      let totalRecords: number = 0
      let cursor: string | null | undefined = null

      do {
        const actionRun = await actionInstance.run({ cursor })

        if (records.length > 0) {
          totalRecords += records.length
          records = actionRun.output.records.map((record: DataRecord) => {
            return { ...record, ...commonFields }
          })

          await collection.insertMany(records)
        }

        cursor = actionRun.output.cursor
      } while (cursor && totalRecords <= 1000)

      return NextResponse.json({ records }, { status: 200 })
    } catch (error) {
      return handleError(error, 500)
    }
  } catch (error) {
    console.error(error)
    return handleError(error, 400)
  }
}
