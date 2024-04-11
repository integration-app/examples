'use client'

import { Card } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'

export default function FlowRunItem({ data }: { data: any }) {
  const emojiByState = {
    queued: '⏳',
    running: '🏃',
    completed: '✅',
    stopped: '⏹️',
    failed: '❌',
  } as { [key: string]: string }

  return (
    <Card className='mt-2 p-4'>
      <Collapsible>
        <div className='flex px-4'>
          <div className='w-1/4 py-2'>{data?.flowInstance?.name}</div>
          <div className='w-1/2 py-2'>
            {JSON.stringify(data?.input?.[0], null, 2)}
          </div>
          <div className='flex-1 w-1/8 py-2 text-right'>
            {emojiByState[data?.state]}
          </div>
          <CollapsibleTrigger asChild className='w-20 ml-8'>
            <Button variant='outline'>Details</Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <pre className='text-xs'>{JSON.stringify(data, null, 2)}</pre>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
