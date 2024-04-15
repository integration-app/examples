import { useContext } from 'react'
import { IntegrationAppProvider } from '@integration-app/react'
import FlowRunLogProvider from '@/components/flow-run-log-provider'

import { TokenContext } from '@/components/token-provider'

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = useContext(TokenContext) as string

  return (
    <div>
      <div>this is a line from [scenario]/layout.tsx</div>
    <IntegrationAppProvider token={token}>
      <FlowRunLogProvider>{children}</FlowRunLogProvider>
    </IntegrationAppProvider>
    </div>
  )
}
