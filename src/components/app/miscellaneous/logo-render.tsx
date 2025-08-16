'use client'
import { useSidebar, useStore } from '@/hooks'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
// import IMAGE_BRAND from '@/assets/brands/festify_logo.svg'
import IMAGE_BRAND_DARK from '@/assets/brands/festify_logo_dark.svg'

export const LogoRender = ({
  href,
  className
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
    <>
      {getOpenState() && (
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
                src={IMAGE_BRAND_DARK}
                alt="logo-festify"
                className="w-32 h-8"
                width={1400}
                height={30}
              />
            </div>
          </Link>
        </section>
      )}
    </>
  )
}
