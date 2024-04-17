'use client'

import { useContext } from 'react'
import { redirect } from 'next/navigation'

import { TokenContext } from '@/components/token-provider'
import { PushCompaniesToACrmScenario } from '../../scenarios/push-companies-to-a-crm'

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
      return (
        <PushCompaniesToACrmScenario params={params} />
      )

    default:
      redirect('/')
  }
}
