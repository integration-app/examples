'use client'

import { useContext } from 'react'
import { IntegrationAppProvider } from '@integration-app/react'
import FlowRunLogProvider from '@/components/flow-run-log-provider'

import { TokenContext } from '@/components/token-provider'

export default function InnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = useContext(TokenContext) as string

  return (
    <IntegrationAppProvider token={token}>
      <FlowRunLogProvider>{children}</FlowRunLogProvider>
    </IntegrationAppProvider>
  )
}
