// external-event-log-records
import { PaginationQuery, ExternalEventLogRecord } from '@integration-app/sdk'
import { useElements } from '@/lib/hooks/use-elements'

interface FindExternalEventLogRecordQuery extends PaginationQuery {
  search?: string
  connectorId?: string
  id?: string
  userId?: string
  externalEventSubscriptionId?: string
  connectionId?: string
  integrationId?: string
}

export function useExternalEventLogRecords(
  query?: FindExternalEventLogRecordQuery,
) {
  const { ...rest } = useElements<ExternalEventLogRecord>(
    'external-event-log-records',
    query,
  )

  return {
    externalEventLogRecords: rest.items,
    ...rest,
  }
}
