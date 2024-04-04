'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  useIntegrationApp,
  IntegrationAppProvider,
  useIntegrations,
} from '@integration-app/react'

import handleToken from '@/lib/token'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Logo from '@/components/logo'

export default function Page() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token === null) {
      handleToken()
    } else {
      setToken(token)
    }
  }, [])
  if (token) {
    return (
      <IntegrationAppProvider token={token}>
        <IntegrationsList />
      </IntegrationAppProvider>
    )
  }
}

function IntegrationsList() {
  const { items } = useIntegrations()
  const integrationApp = useIntegrationApp()

  return (
    <div className='max-w-screen-md mx-auto'>
      <p className='my-10 max-w-2xl text-xl text-gray-500 dark:text-slate-400 lg:mx-auto text-center'>
        Please select an app to connect
      </p>
      <div className='grid grid-cols-5 gap-8'>
        {items
          .sort((first, second) => {
            return first.name < second.name ? -1 : 1
          })
          .map((integration, index) => (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    onClick={() =>
                      integrationApp.integration(integration.id).connect()
                    }
                    href={integration.key}
                    key={index}
                  >
                    <Card>
                      <Logo
                        className='rounded-lg max-w-20'
                        src={integration.logoUri}
                        alt={integration.name}
                      />
                    </Card>
                  </Link>
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
