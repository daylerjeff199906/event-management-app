'use client'
import { useSidebar, useStore } from '@/hooks'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { APP_CONFIG } from '@/data/config.app'

export const LogoRender = ({
  href,
  className,
  size,
  isOpened
}: {
  nameApp?: string
  subtitle?: string
  href: string
  className?: string
  size?: number
  isOpened?: boolean
}) => {
  const sidebar = useStore(useSidebar, (x) => x)
  if (!sidebar) return null
  const { getOpenState } = sidebar

  return (
    <>
      {(getOpenState() || isOpened) && (
        <section
          id="logo"
          className={cn(
            'flex flex-col items-center gap-2 w-full hover:cursor-pointer justify-center px-2',
            className
          )}
        >
          <Link
            href={href}
            className="flex items-center gap-4 w-full justify-center"
          >
            <div className="flex flex-col items-start justify-center w-full">
              <Image
                src={APP_CONFIG.logos.logoHorizontalDark}
                alt="logo-festify"
                width={size ?? 140}
                height={size ? Math.round(size * 0.21) : 30} // Mantiene proporción aproximada
                style={{
                  width: size ? `${size}px` : '140px',
                  height: size ? `${Math.round(size * 0.21)}px` : '30px',
                  objectFit: 'contain'
                }}
                className="transition-all"
              />
            </div>
          </Link>
        </section>
      )}
    </>
  )
}
