'use client'

import React, { useEffect, useState } from 'react'
import { IntegrationAppProvider, useIntegrations } from '@integration-app/react'

import handleToken from '@/lib/token'
import Store from '@/lib/store'
import { Icons } from '@/components/icons'
import { CompanyForm } from '@/components/company-form'
import { CompaniesTable } from '@/components/companies-table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Company } from '@/components/company-form'

export default function Page() {
  const [token, setToken] = useState<string | null>(null)
  const [companies, setCompanies] = useState<Company[] | unknown>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null) {
      handleToken()
    } else {
      setToken(token)
    }

    const store = new Store('companies')
    setCompanies(store.getAll())
  }, [])
  if (token) {
    return (
      <>
        <div className='flex justify-left mt-2'>
          <h2 className='mr-4 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-slate-200 sm:text-4xl gap-6'>
            Companies
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create new</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new company</DialogTitle>
                <DialogDescription>
                  Next you will be able to push it to a CRM
                </DialogDescription>
              </DialogHeader>
              <CompanyForm />
            </DialogContent>
          </Dialog>
        </div>
        <IntegrationAppProvider token={token}>
          <CompaniesTable />
        </IntegrationAppProvider>
      </>
    )
  }
}
