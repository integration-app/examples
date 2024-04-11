'use client'

import React, { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'

import CompaniesPage from '@/components/companies-page'
import CompaniesProvider from '@/components/companies-provider'

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
        <CompaniesProvider>
          <CompaniesPage params={params} />
        </CompaniesProvider>
      )

    default:
      redirect('/')
  }
}
