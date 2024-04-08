'use client'

import React, { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'

import { CompanyForm } from '@/components/company-form'
import { CompaniesProvider } from '@/components/companies-table'

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
          <CompanyForm params={params} />
        </CompaniesProvider>
      )

    default:
      redirect('/')
  }
}
