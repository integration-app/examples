'use client'

import React, { useContext, useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import {
  useIntegrationApp,
  useIntegrations,
  useConnections,
} from '@integration-app/react'
import { Connection, Integration } from '@integration-app/sdk'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Logo from '@/components/logo'
import { siteConfig } from '@/config/site'
import { Scenario } from '@/lib/types'
import { cn } from '@/lib/utils'
import DataRepo from '@/lib/data-repo'
import { TokenContext } from '@/components/token-provider'

interface ConnectPageProps {
  params: {
    scenario: string
  }
}

export default function ConnectPage({ params }: ConnectPageProps) {
  if (!siteConfig.scenarios.map((i) => i.slug).includes(params.scenario)) {
    redirect('/')
  }

  const token = useContext(TokenContext) as string

  if (token) {
    return <IntegrationsList params={params} />
  }
}

function IntegrationsList({ params }: ConnectPageProps) {
  const router = useRouter()
  const integrationApp = useIntegrationApp()
  const { items } = useIntegrations()
  const { connections } = useConnections()
  const connectionsRepo = new DataRepo('connections')
  const [activeIntegrations, setActiveIntegrations] = useState<string[]>([])

  const activeScenario = siteConfig.scenarios.find(
    (i) => i.slug === params.scenario,
  ) as Scenario

  useEffect(() => {
    integrationApp
      .flow({ key: activeScenario.flowKey })
      .get()
      .then((flow) => {
        const integrations =
          flow.appliedToIntegrations?.map((item) => item.integration.key) || []
        setActiveIntegrations(integrations)
      })
  }, [])

  const isConnected = (integrationKey: string) => {
    const savedConnection = connectionsRepo.getItem(
      (i: any) => i.integration.key === integrationKey,
    ) as Connection

    return (
      savedConnection && !savedConnection.error && !savedConnection.disconnected
    )
  }

  connectionsRepo.putAll(
    connections.filter((connection) => {
      return connection.integration
    }),
  )

  async function openConnection(integration: Integration) {
    if (isConnected(integration.key)) {
      router.push(`${params.scenario}/${integration.key}`)
    } else {
      const connection = await integrationApp
        .integration(integration.key)
        .openNewConnection({ showPoweredBy: false })
      if (connection && !connection.error && !connection.disconnected) {
        connectionsRepo.addItem(connection)
        router.push(`${params.scenario}/${integration.key}`)
      }
    }
  }

  return (
    <div className='max-w-screen-md mx-auto'>
      <p className='my-10 max-w-2xl text-xl text-gray-500 dark:text-slate-400 lg:mx-auto text-center'>
        Please select an app to connect
      </p>
      <div className='grid grid-cols-3 md:grid-cols-5 gap-8'>
        {items
          .sort((first, second) => {
            return first.name < second.name ? -1 : 1
          })
          .filter((integration) => activeIntegrations.includes(integration.key))
          .map((integration, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => openConnection(integration)}
                    className='bg-white dark:bg-black hover:bg-background border w-24 h-24 p-2 rounded-2xl'
                  >
                    <Card className='border-hidden'>
                      <Logo
                        key={index}
                        className={cn(
                          'rounded-lg max-w-20',
                          integration.connection ? 'outline-4' : '',
                        )}
                        src={integration.logoUri}
                        alt={integration.name}
                      />
                    </Card>
                    {isConnected(integration.key) ? (
                      <span className='relative'>
                        <span className='inline-block absolute top-6 -right-2 rounded-md bg-green-50 dark:bg-green-950 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-500 ring-1 ring-inset ring-green-500/10'>
                          active
                        </span>
                      </span>
                    ) : null}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{integration.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
      </div>
    </div>
  )
}
