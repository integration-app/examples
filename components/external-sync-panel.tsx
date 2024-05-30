import { useState } from 'react'
import { ExternalEventSubscription, FlowInstance } from '@integration-app/sdk'
import {
  useExternalEventSubscriptions,
  useIntegrationApp,
} from '@integration-app/react'
import { toSentenceCase } from 'js-convert-case'
import { formatDistanceToNow } from 'date-fns'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ExternalSyncPanel({
  flowInstance,
}: {
  flowInstance: FlowInstance
}) {
  const externalEventSubscriptions = useExternalEventSubscriptions({
    integrationId: flowInstance.integrationId,
  })
  const eventTypes = externalEventSubscriptions.items.map(
    (item) => item.config?.type,
  )
  const [syncPanelTab, setSyncPanelTab] = useState(eventTypes[0])
  const integrationApp = useIntegrationApp()

  async function pullUpdates(sub: ExternalEventSubscription) {
    await integrationApp.externalEventSubscription(sub.id).pullEvents()
  }

  return (
    <div className='my-4'>
      <Tabs
        defaultValue={syncPanelTab}
        value={syncPanelTab}
        className='flex-container'
      >
        <TabsList
          className={`grid w-full bg-gray-200 grid-cols-${eventTypes.length}`}
        >
          {eventTypes.map((value, index) => (
            <TabsTrigger
              key={index}
              value={value}
              onClick={() => setSyncPanelTab(value)}
            >
              {toSentenceCase(value)}
            </TabsTrigger>
          ))}
        </TabsList>
        {eventTypes.map((value, index) => (
          <TabsContent key={index} value={value}>
            <Card className='px-6 py-4'>
              {externalEventSubscriptions.items
                .filter((sub) => sub.config?.type === value)
                .map((sub, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between'
                  >
                    <div>
                      {sub.isRealTime
                        ? 'Receiving updates in real-time (it can take a few seconds to reflect in UI)'
                        : sub.nextPullEventsTimestamp
                          ? `Next update pull scheduled ${formatDistanceToNow(
                              sub.nextPullEventsTimestamp,
                              { addSuffix: true },
                            )}`
                          : 'No scheduled updates'}
                      {!sub.isRealTime && (
                        <Button
                          variant='outline'
                          className='ml-4'
                          onClick={() => pullUpdates(sub)}
                        >
                          Pull Updates Now
                        </Button>
                      )}
                    </div>
                    {sub.status === 'error' && (
                      <div>{JSON.stringify(sub.error)}</div>
                    )}
                  </div>
                ))}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
