import Link from 'next/link'
import { Icons } from '@/components/icons'
import { Card } from '@/components/ui/card'

interface ScenarioCardProps {
  name: string
  description: string
  link: string
}

export default function ScenarioCard(
  props: ScenarioCardProps,
): React.ReactElement {
  return (
    <Link href={props.link} className='inline-block w-full'>
      <Card className='p-4 bg-slate-50 hover:bg-slate-250 dark:bg-slate-950 dark:hover:bg-slate-750'>
        <span className='sr-only'>View</span>
        <dt>
          <div className='absolute flex items-center justify-center h-12 w-12 rounded-md border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100'>
            <Icons.script className='h-6 w-6' />
          </div>
          <p className='ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-slate-200'>
            {props.name}
          </p>
        </dt>
        <dd className='ml-16 text-base text-gray-500 dark:text-slate-400'>
          {props.description}
        </dd>
      </Card>
    </Link>
  )
}
