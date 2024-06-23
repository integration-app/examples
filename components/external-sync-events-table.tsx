import { ExternalEventLogRecord } from '@integration-app/sdk'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import JsonViewer from '@/components/json-viewer'

export default function ExternalSyncEventsTable({
  events,
}: {
  events: ExternalEventLogRecord[]
}) {
  return (
    <Table className='min-w-full leading-normal'>
      <TableHeader>
        <TableRow>
          <TableCell>Event ID</TableCell>
          <TableCell>Details</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event: ExternalEventLogRecord) => {
          return (
            <TableRow key={event.id}>
              <TableCell>{event.id}</TableCell>
              <TableCell>
                <div className='overflow-auto max-h-80'>
                  <JsonViewer json={event.payload} />
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
