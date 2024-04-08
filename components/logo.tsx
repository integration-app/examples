import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  src: string
  alt: string
  className: string
}

export default function Logo(props: LogoProps) {
  return (
    <div>
      <Image
        src={props.src}
        alt={props.alt}
        width={128}
        height={128}
        className={cn('max-w-32 max-h-32', props.className)}
      />
    </div>
  )
}
