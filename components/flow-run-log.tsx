import React, { useContext, useEffect } from 'react'
import { useIntegrationApp } from '@integration-app/react'
import { Connection } from '@integration-app/sdk'

import FlowRunItem from '@/components/flow-run-item'
import DataRepo from '@/lib/data-repo'
import {
  FlowRunLogContext,
  FlowRunLogContextType,
} from '@/components/flow-run-log-provider'

export default function FlowRunLog({
  integrationKey,
}: {
  integrationKey: string
}) {
  const integrationApp = useIntegrationApp()

  const { flowRunItems, setFlowRunItems } = useContext(
    FlowRunLogContext,
  ) as FlowRunLogContextType

  useEffect(() => {
    async function loadFlowRuns(integrationKey: string) {
      const connectionsRepo = new DataRepo('connections')
      const connection = connectionsRepo.getItem(
        (i: any) => i.integration.key === integrationKey,
      ) as Connection
      const integrationId = connection.integrationId
      const flowRuns = await integrationApp.flowRuns.find({
        integrationId: integrationId,
        limit: 5,
      })
      return flowRuns.items
    }

    loadFlowRuns(integrationKey)
      .then((result) => {
        setFlowRunItems(result)
      })
      .catch((error) => {
        console.error('Error loading Flow Runs:', error)
      })
  }, [integrationApp, integrationKey])

  return (
    <div className='mt-4'>
      <h2 className='text-2xl font-bold'>Integration Run Log</h2>
      {flowRunItems?.length ? (
        flowRunItems.map((item: any, index: number) => (
          <FlowRunItem key={index} data={item} skipInputWrapper='company' />
        ))
      ) : (
        <section className='py-12'>Integration logs will appear here.</section>
      )}
    </div>
  )
}
