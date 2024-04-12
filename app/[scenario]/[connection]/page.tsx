'use client'

import { redirect } from 'next/navigation'

import CompaniesPage from '@/components/companies-page'
import CompaniesProvider from '@/components/companies-provider'
import FlowRunLogProvider from '@/components/flow-run-log-provider'

export interface FlowPageProps {
  params: {
    scenario: string
    connection: string
  }
}

export default function FlowPage({ params }: FlowPageProps) {
  switch (params.scenario) {
    case 'push-companies-to-a-crm':
      return (
        <FlowRunLogProvider>
          <CompaniesProvider>
            <CompaniesPage params={params} />
          </CompaniesProvider>
        </FlowRunLogProvider>
      )

    default:
      redirect('/')
  }
}
