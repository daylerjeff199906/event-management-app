'use client'
import { useSidebar, useStore } from '@/hooks'
import { cn } from '@/lib/utils'
import { BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const LogoRender = ({
  nameApp,
  subtitle,
  href,
  className,
}: {
  nameApp?: string
  subtitle?: string
  href: string
  className?: string
}) => {
  const sidebar = useStore(useSidebar, (x) => x)
  if (!sidebar) return null
  const { getOpenState } = sidebar

  return (
    <section
      id="logo"
      className={cn(
        'flex flex-col items-center gap-2 w-full hover:cursor-pointer justify-center px-2',
        className
      )}
    >
      <Link
        href={href}
        className="flex items-center gap-4 w-full"
      >
        <div>
          <div className="w-10 h-10 bg-emerald-600 rounded-md flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        {!nameApp && (
          <Image
            src="/brands/postgrado_unap_white.webp"
            alt="logo-epg"
            className="w-52 h-14"
            width={300}
            height={40}
          />
        )}
        {getOpenState() && (
          <div className="flex flex-col items-start">
            {nameApp && (
              <h1 className={cn(' font-bold text-lg', className)}>
                {nameApp || 'ESCUELA DE POSTGRADO UNAP'}
              </h1>
            )}
            {subtitle && (
              <h2 className="w-32 min-w-32 font-semibold text-xs text-gray-400 uppercase">
                {subtitle}
              </h2>
            )}
          </div>
        )}
      </Link>
    </section>
  )
}
