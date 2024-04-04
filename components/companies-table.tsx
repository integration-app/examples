'use client'

import React, { useEffect, useState } from 'react'
import {
  useIntegrationApp,
  IntegrationAppProvider,
  useIntegrations,
} from '@integration-app/react'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Store from '@/lib/store'
import { siteConfig } from '@/config/site'
import { Company } from '@/components/company-form'

const store = new Store('companies')

function deleteCompany(domain: string) {
  store.deleteItem((i: any) => i.domain == domain)
}

export function CompaniesTable() {
  const [companies, setCompanies] = useState<any[]>([])
  const integrationApp = useIntegrationApp()
  const flowKey = siteConfig.scenarios.find(
    (i) => i.slug == window.location.pathname.split('/')[1],
  )?.flowKey
  const integrationKey = window.location.pathname.split('/')[2]
  useEffect(() => setCompanies(store.getAll()), [])

  return (
    <>
      {companies?.length ? (
        <Table className='mt-4'>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>{company.name}</TableCell>
                <TableCell>{company.domain}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      const instance = integrationApp
                        .flowInstance({
                          flowKey: flowKey,
                          integrationKey: integrationKey,
                          autoCreate: true,
                        })
                        .run({
                          input: {
                            company: {
                              name: company.name,
                              domain: company.domain,
                            },
                          },
                        })
                    }}
                    className='mx-4'
                  >
                    <Icons.push className='w-4 mr-3' />
                    Push to CRM
                  </Button>
                  <Button onClick={() => deleteCompany(company.domain)}>
                    <Icons.trash className='w-4' />
                  </Button>
                  {company.pushedInto?.join(' ')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <section className='py-12'>You have no companies.</section>
      )}
    </>
  )
}
