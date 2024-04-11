'use client'

import React, { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import {
  useIntegrationApp,
  IntegrationAppProvider,
  useIntegrations,
  useConnections,
} from '@integration-app/react'

import handleToken from '@/lib/token'
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
import { Integration } from '@integration-app/sdk'
import DataRepo from '@/lib/data-repo'

interface ConnectPageProps {
  params: {
    scenario: string
  }
}

export default function ConnectPage({ params }: ConnectPageProps) {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null) {
      handleToken()
    } else {
      setToken(token)
    }
  }, [])

  if (!siteConfig.scenarios.map((i) => i.slug).includes(params.scenario)) {
    redirect('/')
  }

  if (token) {
    return (
      <IntegrationAppProvider token={token}>
        <IntegrationsList params={params} />
      </IntegrationAppProvider>
    )
  }
}

function IntegrationsList({ params }: ConnectPageProps) {
  const router = useRouter()
  const integrationApp = useIntegrationApp()
  const { items } = useIntegrations()
  const { connections } = useConnections()
  const connectionsRepo = new DataRepo('connections')

  const isDisabled = (integrationKey: string) => {
    const activeScenario = siteConfig.scenarios.find(
      (i) => i.slug === params.scenario,
    ) as Scenario

    if (activeScenario.supportedApps?.length) {
      return !activeScenario.supportedApps.includes(integrationKey)
    } else return false
  }

  const isConnected = (integrationKey: string) => {
    const savedConnection = connectionsRepo.getItem(
      (i: any) => i.integration.key === integrationKey,
    ) as any

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
          .map((integration, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => openConnection(integration)}
                    disabled={isDisabled(integration.key)}
                    className={cn(
                      isDisabled(integration.key) ? 'cursor-not-allowed' : '',
                      isConnected(integration.key)
                        ? 'border-b-3 border-indigo-500'
                        : '',
                      'bg-white dark:bg-black hover:bg-background border w-24 h-24 p-2 rounded-2xl',
                    )}
                  >
                    <Card
                      className={cn(
                        isDisabled(integration.key)
                          ? 'opacity-40'
                          : 'opacity-100',
                        'border-hidden',
                      )}
                    >
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
