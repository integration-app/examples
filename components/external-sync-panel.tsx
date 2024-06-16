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
import { formatDistanceToNow, set } from 'date-fns'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/table'
import { useTheme } from 'next-themes'
import ReactJson from '@microlink/react-json-view'

export default function ExternalSyncPanel({
  flowInstance,
}: {
  flowInstance: FlowInstance
}) {
  const externalEventSubscriptions = useExternalEventSubscriptions({
    integrationId: flowInstance.integrationId,
  }).items as unknown as ExternalEventSubscription[]
  const eventTypes = externalEventSubscriptions.map(
    (sub) => sub.config?.type as string,
  )
  const [syncPanelTab, setSyncPanelTab] = useState(0)
  const [pullingUpdates, setPullingUpdates] = useState(false)
  const [events, setEvents] = useState<ExternalEventLogRecord[]>([])
  const themeData = useTheme()
  const integrationApp = useIntegrationApp()

  async function pullUpdates(sub: ExternalEventSubscription) {
    setPullingUpdates(true)
    await integrationApp.externalEventSubscription(sub.id).pullEvents()
    setPullingUpdates(false)
  }

  async function loadEvents() {
    return await integrationApp.get(`/external-event-log-records`)
  }

  useEffect(() => {
    loadEvents().then((data) => {
      setEvents(data.items)
    })
  }, [])

  return (
    <div className='my-4'>
      <Tabs value={eventTypes[syncPanelTab]} className='flex-container'>
        <TabsList className='grid w-full grid-cols-3'>
          {eventTypes.map((value, index) => (
            <TabsTrigger
              key={index}
              value={value}
              onClick={() => setSyncPanelTab(eventTypes.indexOf(value))}
            >
              {toSentenceCase(value)}
            </TabsTrigger>
          ))}
        </TabsList>
        {eventTypes.map((value, index) => (
          <TabsContent key={index} value={value} tabIndex={-1}>
            <Card className='px-6 py-4'>
              {externalEventSubscriptions
                .filter((sub) => sub.config?.type === value)
                .map((sub, index) => (
                  <div key={index}>
                    {sub.isRealTime ? (
                      <div className='py-2'>
                        Receiving updates in real-time (it can take a few
                        seconds to reflect in UI)
                      </div>
                    ) : sub.nextPullEventsTimestamp ? (
                      `Next update pull scheduled ${formatDistanceToNow(
                        sub.nextPullEventsTimestamp,
                        { addSuffix: true },
                      )}`
                    ) : (
                      <div>No scheduled updates</div>
                    )}
                    {!sub.isRealTime && sub.status !== 'error' && (
                      <Button
                        variant='outline'
                        className='ml-4'
                        onClick={() => pullUpdates(sub)}
                        disabled={pullingUpdates}
                      >
                        Pull Updates Now
                      </Button>
                    )}
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
                    {events?.filter((e) => {
                      return e.externalEventSubscriptionId === sub.id
                    }).length > 0 && (
                      <Table className='min-w-full leading-normal'>
                        <TableHeader>
                          <TableRow>
                            <TableCell>Event ID</TableCell>
                            <TableCell>Details</TableCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {events
                            .filter((e) => {
                              return e.externalEventSubscriptionId === sub.id
                            })
                            .map((item, index) => {
                              return (
                                <TableRow key={index}>
                                  <TableCell>{item.id}</TableCell>
                                  <TableCell>
                                    <div className='overflow-auto max-h-80'>
                                      <ReactJson
                                        src={item.payload}
                                        name={false}
                                        collapsed={1}
                                        quotesOnKeys={false}
                                        enableClipboard={false}
                                        displayDataTypes={false}
                                        displayObjectSize={false}
                                        iconStyle='square'
                                        style={{
                                          padding: 8,
                                          backgroundColor: 'transparent',
                                        }}
                                        theme={
                                          themeData.resolvedTheme === 'light'
                                            ? 'rjv-default'
                                            : 'harmonic'
                                        }
                                      />
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                        </TableBody>
                      </Table>
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
