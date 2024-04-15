'use client'

import React, { useState, useContext, useEffect } from 'react'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  CompaniesContext,
  type CompaniesContextType,
} from '@/components/companies-provider'
import {
  FlowRunLogContext,
  FlowRunLogContextType,
} from '@/components/flow-run-log-provider'
import { FlowRun } from '@integration-app/sdk'

export function CompaniesTable({ params }: FlowPageProps) {
  const integrationApp = useIntegrationApp()

  const activeScenario = siteConfig.scenarios.find(
    (i) => i.slug === params.scenario,
  ) as Scenario
  const flowKey = activeScenario?.flowKey
  const integrationKey = params.connection

  const [pushing, setPushing] = useState({})
  const [output, setOutput] = useState({})
  const [outputOpen, setOutputOpen] = useState(false)
  const { dataRepo, companies, setCompanies } = useContext(
    CompaniesContext,
  ) as CompaniesContextType
  const { flowRunItems, setFlowRunItems, addFlowRunItem } = useContext(
    FlowRunLogContext,
  ) as FlowRunLogContextType

  function handleUpdate(flowRun: FlowRun) {
    // const existingIndex = flowRunItems.findIndex((item) => {
    //   return item.id === flowRun.id
    // })

    // if (existingIndex !== -1) {
    //   setFlowRunItems((items) => {
    //     items[existingIndex] = flowRun
    //     return items
    //   })
    // } else {
    //   addFlowRunItem(flowRun)
    // }

    setFlowRunItems([flowRun, ...flowRunItems])
  }

  const pushCompany = async (company: Company) => {
    try {
      setPushing((state) => ({ ...state, [company.domain]: true }))
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
          onUpdate: handleUpdate,
        })

      const flowRunId = flowRun.id
      const output = await integrationApp.flowRun(flowRunId).getOutput()

      setOutput(output.items[0]?.unifiedFields)
      setOutputOpen(true)

      company.pushedInto[integrationKey] = output.items[0]

      dataRepo.updateItem(
        (i: any) => i.domain === company.domain,
        () => company,
      )

      setPushing((state) => ({ ...state, [company.domain]: false }))
    } catch (error) {
      console.error('Error pushing company:', error)
    }
  }

  const deleteCompany = (company: Company) => {
    dataRepo.deleteItem((i: any) => i.domain === company.domain)
    setCompanies(dataRepo.getAll())
  }

  const isPushing = (company: Company) => {
    return company.domain in pushing
  }

  const isPushed = (company: Company) => {
    return Object.keys(company.pushedInto).includes(integrationKey)
  }

  return (
    <>
      {companies?.length ? (
        <>
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
          <Dialog open={outputOpen} onOpenChange={setOutputOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Push completed</DialogTitle>
                <DialogDescription>
                  Here are details returned by CRM
                </DialogDescription>
              </DialogHeader>
              <div>{JSON.stringify(output, null, 2)}</div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <section className='py-12'>Companies will appear here.</section>
      )}
    </>
  )
}
