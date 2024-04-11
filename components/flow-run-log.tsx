'use client'

import React, { useEffect, useState } from 'react'
import { useIntegrationApp } from '@integration-app/react'

import FlowRunItem from '@/components/flow-run-item'
import DataRepo from '@/lib/data-repo'

export default function FlowRunLog({
  integrationKey,
}: {
  integrationKey: string
}) {
  const integrationApp = useIntegrationApp()
  const [flowRunItems, setFlowRunItems] = useState<any>([])

  useEffect(() => {
    async function loadFlowRuns(integrationKey: string) {
      const connectionsRepo = new DataRepo('connections')
      const connection = connectionsRepo.getItem(
        (i: any) => i.integration.key === integrationKey,
      ) as any
      const integrationId = connection.integrationId
      const flowRuns = await integrationApp.flowRuns.find({
        integrationId: integrationId,
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
          <FlowRunItem key={index} data={item} />
        ))
      ) : (
        <section className='py-12'>Log is empty.</section>
      )}
    </div>
  )
}
