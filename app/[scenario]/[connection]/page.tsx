'use client'

import { useContext } from 'react'
import { redirect } from 'next/navigation'

import CompaniesPage from '@/components/companies-page'
import CompaniesProvider from '@/components/companies-provider'
import { TokenContext } from '@/components/token-provider'

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
        <CompaniesProvider>
          <CompaniesPage params={params} />
        </CompaniesProvider>
      )

    default:
      redirect('/')
  }
}
