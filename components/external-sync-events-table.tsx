import { ExternalEventLogRecord } from '@integration-app/sdk'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import ReactJson from '@microlink/react-json-view'
import { useTheme } from 'next-themes'

export default function ExternalSyncEventsTable({
  events,
}: {
  events: ExternalEventLogRecord[]
}) {
  const themeData = useTheme()

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
                  <ReactJson
                    src={event.payload}
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
  )
}
