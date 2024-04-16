import React, { useState, useContext } from 'react'
import Link from 'next/link'
import { useIntegrationApp } from '@integration-app/react'

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
import { siteConfig } from '@/config/site'
import { Company, Scenario } from '@/lib/types'
import { FlowPageProps } from '@/app/[scenario]/[connection]/page'
import {
  CompaniesContext,
  type CompaniesContextType,
} from '@/components/companies-provider'
import {
  FlowRunLogContext,
  FlowRunLogContextType,
} from '@/components/flow-run-log-provider'

export function CompaniesTable({ params }: FlowPageProps) {
  const integrationApp = useIntegrationApp()

  const activeScenario = siteConfig.scenarios.find(
    (i) => i.slug === params.scenario,
  ) as Scenario
  const flowKey = activeScenario?.flowKey
  const integrationKey = params.connection

  const [pushing, setPushing] = useState<number[]>([])
  const { dataRepo, companies, setCompanies } = useContext(
    CompaniesContext,
  ) as CompaniesContextType
  const { upsertFlowRunItem } = useContext(
    FlowRunLogContext,
  ) as FlowRunLogContextType

  const pushCompany = async (company: Company) => {
    try {
      setPushing((state) => [...state, company.id])
      const flowRun = await integrationApp
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
          onUpdate: upsertFlowRunItem,
        })

      const flowRunId = flowRun.id
      const output = await integrationApp.flowRun(flowRunId).getOutput()

      company.pushedInto[integrationKey] = output.items[0]

      dataRepo.updateItem(
        (i: any) => i.id === company.id,
        () => company,
      )

      setPushing((state) => state.filter((i) => i !== company.id))
    } catch (error) {
      console.error('Error pushing company:', error)
    }
  }

  const deleteCompany = (company: Company) => {
    dataRepo.deleteItem((i: any) => i.id === company.id)
    setCompanies(dataRepo.getAll())
  }

  const isPushing = (company: Company) => {
    return pushing.includes(company.id)
  }

  const isPushed = (company: Company) => {
    return Object.keys(company.pushedInto).includes(integrationKey)
  }

  return (
    <>
      {companies?.length ? (
        <Table className='mt-4 w-'>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead className='w-[100px]'></TableHead>
              <TableHead className='w-4'></TableHead>
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
                      href={company.pushedInto[integrationKey].uri}
                      target='_blank'
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
        <section className='py-12'>Companies will appear here.</section>
      )}
    </>
  )
}
