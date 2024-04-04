'use client'

import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { siteConfig } from '@/config/site'
import { UrlObject } from 'url'

async function stateFromUrl() {
  return (
    <>
      <Link href='/new' rel='nofollow'>
        <Icons.logo />
        <Icons.trash />
      </Link>
      <div className='flex items-center'>
        <Button variant='link' asChild className='-ml-2'>
          <Link href='/login'>Login</Link>
        </Button>
      </div>
    </>
  )
}

export default function Header({ children }: any) {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  return (
    <div className='flex gap-6 md:gap-10'>
      <Link href='/' className='hidden items-center space-x-2 md:flex'>
        <Icons.logo />
        <span className='hidden font-bold sm:inline-block'>
          {siteConfig.name}
        </span>
      </Link>
    </div>
  )
}
