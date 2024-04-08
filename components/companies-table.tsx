'use client'

import React, { useEffect, useState, useContext } from 'react'
import Link from 'next/link'
import {
  useIntegrationApp,
  IntegrationAppProvider,
  useIntegrations,
} from '@integration-app/react'

import { Button, buttonVariants } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { Company, Scenario } from '@/lib/types'
import { FlowPageProps } from '@/app/[scenario]/[connection]/page'

const store = new Store('companies')
export const CompaniesContext = React.createContext({})

export interface CompaniesContextType {
  store: any
  companies: Company[]
  setCompanies: (_: Company[]) => void
}

export function CompaniesProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    const loadCompanies = () => {
      if (localStorage.companies === undefined) {
        const initialCompanies = siteConfig.seed.companies as Company[]
        store.putAll(initialCompanies)
        return initialCompanies
      } else {
        return store.getAll() as Company[]
      }
    }

    const loadedCompanies = loadCompanies()
    setCompanies(loadedCompanies)
  }, [])

  return (
    <CompaniesContext.Provider value={{ store, companies, setCompanies }}>
      {children}
    </CompaniesContext.Provider>
  )
}

export function CompaniesTable({ params }: FlowPageProps) {
  const integrationApp = useIntegrationApp()

  const activeScenario = siteConfig.scenarios.find(
    (i) => i.slug == params.scenario,
  ) as Scenario
  const flowKey = activeScenario?.flowKey
  const integrationKey = params.connection

  const [pushing, setPushing] = useState({})
  const { store, companies, setCompanies } = useContext(
    CompaniesContext,
  ) as CompaniesContextType

  const pushCompany = (company: Company) => {
    setPushing((state) => ({ ...state, [company.domain]: true }))
    integrationApp
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
      .then((flowRun) => {
        setPushing((state) => ({ ...state, [company.domain]: false }))
        company.pushedInto.push(integrationKey)
        store.updateItem(
          (i: any) => i.domain == company.domain,
          () => {
            return company
          },
        )

        return flowRun.id
      })
  }

  const deleteCompany = (company: Company) => {
    store.deleteItem((i: any) => i.domain == company.domain)
    setCompanies(store.getAll())
  }

  const isPushing = (company: Company) => {
    return company.domain in pushing
  }

  const isPushed = (company: Company) => {
    return company.pushedInto.includes(integrationKey)
  }

  return (
    <>
      {companies?.length ? (
        <Table className='mt-4'>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead className='w-[100px]'></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>{company.name}</TableCell>
                <TableCell>{company.domain}</TableCell>
                <TableCell className='text-right'>
                  {isPushed(company) ? (
                    <Link
                      className={buttonVariants({ variant: 'outline' })}
                      href='#'
                    >
                      <Icons.eye className='w-4 mr-3' />
                      Open in CRM
                    </Link>
                  ) : isPushing(company) ? (
                    <Button disabled>
                      <Icons.spinner className='w-4 mr-3 animate-spin' />
                      Pushing
                    </Button>
                  ) : (
                    <Button onClick={() => pushCompany(company)}>
                      <Icons.push className='w-4 mr-3' />
                      Push to CRM
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Button onClick={() => deleteCompany(company)}>
                    <Icons.trash className='w-4' />
                  </Button>
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
