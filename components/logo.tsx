import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  src: string
  alt: string
  className: string
}

export default function Logo(props: LogoProps) {
  return (
    <div>
      <img
        src={props.src}
        alt={props.alt}
        className={cn('max-w-32 max-h-32', props.className)}
      />
    </div>
  )
}
