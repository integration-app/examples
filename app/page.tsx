'use client'

import ScenarioCard from '@/components/scenario-card'
import { siteConfig } from '@/config/site'

export default function Home() {
  return (
    <section className='py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-slate-100 sm:text-4xl'>
            {siteConfig.name}
          </h1>
          <p className='mt-4 max-w-2xl text-xl text-gray-500 dark:text-slate-400 dark:text-slate-400 lg:mx-auto'>
            {siteConfig.description}
          </p>
        </div>
        <div className='mt-10'>
          <dl className='space-y-5 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-8'>
            {siteConfig.scenarios.map((item, index) => (
              <ScenarioCard
                key={index}
                name={item.name}
                description={item.description}
                link={item.disabled ? '#' : `/${item.slug}`}
              />
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
