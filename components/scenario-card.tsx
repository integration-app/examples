import Link from 'next/link'
import { Icons } from '@/components/icons'

interface ScenarioCardProps {
  name: string
  description: string
  link: string
}

export default function ScenarioCard(
  props: ScenarioCardProps,
): React.ReactElement {
  return (
    <div className='relative group'>
      <Link className='absolute inset-0 z-10' href={props.link}>
        <span className='sr-only'>View</span>
      </Link>
      <dt className='relative group'>
        <div className='absolute flex items-center justify-center h-12 w-12 rounded-md border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100'>
          <Icons.script className='h-6 w-6' />
        </div>
        <p className='ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-slate-200'>
          {props.name}
        </p>
      </dt>
      <dd className='mt-2 ml-16 text-base text-gray-500 dark:text-slate-400'>
        {props.description}
      </dd>
    </div>
  )
}
