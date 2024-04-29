'use client'

import { useContext } from 'react'
import { redirect } from 'next/navigation'

import { TokenContext } from '@/components/token-provider'
import { PushCompaniesToACrmScenario } from '@/app/scenarios/push-companies-to-a-crm'
import { ContinuousImportOfFilesScenario } from '@/app/scenarios/continuous-import-of-files'

export interface FlowPageProps {
  params: {
    scenario: string
    connection: string
  }
}

export default function FlowPage({ params }: FlowPageProps) {
  const token = useContext(TokenContext) as string

  if (!token) return <div>Loading...</div>

  switch (params.scenario) {
    case 'push-companies-to-a-crm':
      return <PushCompaniesToACrmScenario params={params} />
    case 'continuous-import-of-files':
      return <ContinuousImportOfFilesScenario params={params} />

    default:
      redirect('/')
  }
}
