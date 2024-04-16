import { Card } from '@/components/ui/card'
import { Icons } from '@/components/icons'

export default function FlowRunItem({
  data,
  skipInputWrapper,
}: {
  data: any
  skipInputWrapper?: string
}) {
  const iconByState = {
    queued: <Icons.queued />,
    running: <Icons.spinner className='animate-spin' />,
    completed: <Icons.completed />,
    stopped: <Icons.stopped />,
    failed: <Icons.failed />,
  } as { [key: string]: React.ReactNode }

  return (
    <Card className='mt-2 p-4'>
      <div className='flex px-4 gap-4'>
        <div className='w-1/4 py-2'>{data?.flowInstance?.name}</div>
        <div className='w-1/2 py-2'>
          {JSON.stringify(
            skipInputWrapper
              ? data?.input?.[0]?.[skipInputWrapper]
              : data?.input?.[0],
            null,
            2,
          )}
        </div>
        <div className='flex-1 flex py-2 justify-end'>
          {iconByState[data?.state]}
        </div>
      </div>
    </Card>
  )
}
