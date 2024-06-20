import { useEffect, useState } from 'react'
import {
  ExternalEventLogRecord,
  ExternalEventSubscription,
  FlowInstance,
} from '@integration-app/sdk'
import {
  useExternalEventSubscriptions,
  useIntegrationApp,
} from '@integration-app/react'
import { toSentenceCase } from 'js-convert-case'
import { formatDistanceToNow } from 'date-fns'
import { Webhook, WebhookOff } from 'lucide-react'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ExternalSyncEventsTable from '@/components/external-sync-events-table'

export default function ExternalSyncPanel({
  flowInstance,
}: {
  flowInstance: FlowInstance
}) {
  const {
    items: initialSubscriptions,
    refresh: refreshSubscriptions,
    refreshing: refreshingSubscriptions,
  } = useExternalEventSubscriptions({
    integrationId: flowInstance.integrationId,
  })
  const [subscriptions, setSubscriptions] = useState<
    ExternalEventSubscription[]
  >([])
  const [pullingUpdates, setPullingUpdates] = useState<string[]>([])
  const [events, setEvents] = useState<ExternalEventLogRecord[]>([])
  const integrationApp = useIntegrationApp()

  async function pullUpdates(sub: ExternalEventSubscription) {
    setPullingUpdates((state) => [...state, sub.id])
    await integrationApp.externalEventSubscription(sub.id).pullEvents()
    refreshSubscriptions()
    setPullingUpdates((state) => state.filter((i) => i !== sub.id))
  }

  async function loadEvents() {
    const data = await integrationApp.get(`/external-event-log-records`)
    setEvents(data.items)
  }

  useEffect(() => {
    setSubscriptions(initialSubscriptions)
  }, [refreshingSubscriptions, pullingUpdates])

  useEffect(() => {
    let interval: NodeJS.Timeout

    loadEvents()

    interval = setInterval(async () => {
      await loadEvents()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  function pullUpdatesButton(sub: ExternalEventSubscription) {
    if (sub.isRealTime || sub.status === 'error') return
    const isPulling = pullingUpdates.includes(sub.id)
    return (
      <Button
        variant='outline'
        className='ml-4'
        onClick={() => pullUpdates(sub)}
        disabled={isPulling}
      >
        {isPulling ? 'Pulling Updates...' : 'Pull Updates Now'}
      </Button>
    )
  }

  useEffect(() => {
    if (refreshingSubscriptions) return

    const fetchSubscriptionsWithDueUpdates = async () => {
      const now = Date.now()
      const dueSubscriptions = subscriptions.filter(
        (sub) =>
          sub.nextPullEventsTimestamp &&
          new Date(sub.nextPullEventsTimestamp).getTime() < now,
      )

      for (const sub of dueSubscriptions) {
        await pullUpdates(sub)
      }
    }

    fetchSubscriptionsWithDueUpdates()
  }, [new Date().getSeconds()])

  return (
    <Card className='flex flex-col space-y-8 lg:flex-row lg:space-y-0 overflow-auto mb-4'>
      <aside className='lg:w-2/5 bg-muted/50'>
        {subscriptions.length === 0 ? (
          <div className='p-6'>Loading...</div>
        ) : (
          <CardHeader className='mb-[-18px]'>
            <CardTitle>Event Subscriptions</CardTitle>
            <CardDescription>
              It can take a few seconds to reflect any event in UI
            </CardDescription>
          </CardHeader>
        )}
        {subscriptions.map((sub) => (
          <Card key={sub.id} className='m-4 p-2'>
            <CardHeader className='py-2 px-4'>
              <CardTitle className='text-md'>
                {toSentenceCase(sub.config?.type as string)}
                {pullUpdatesButton(sub)}
              </CardTitle>
              {sub.isRealTime ? (
                <div className='py-2'>
                  <Webhook className='w-6 h-6 mr-2 inline' />
                  Receiving updates in real-time
                </div>
              ) : sub.nextPullEventsTimestamp ? (
                <div className='py-2'>
                  <WebhookOff className='w-6 h-6 mr-2 inline' />
                  Next update pull scheduled{' '}
                  {formatDistanceToNow(sub.nextPullEventsTimestamp, {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
                </div>
              ) : (
                <div>No scheduled updates</div>
              )}
            </CardHeader>
            {sub.status === 'error' && (
              <div
                className='bg-red-100 dark:bg-red-950 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative'
                role='alert'
              >
                <strong className='font-bold'>
                  Subscription doesn&apos;t work
                </strong>
                <div>{JSON.stringify(sub.error, null, 2)}</div>
              </div>
            )}
          </Card>
        ))}
      </aside>
      <div className='flex-1 lg:w-3/5'>
        {events?.length > 0 ? (
          <ExternalSyncEventsTable events={events} />
        ) : (
          <div className='p-4 text-sm'>Events will appear here</div>
        )}
      </div>
    </Card>
  )
}
