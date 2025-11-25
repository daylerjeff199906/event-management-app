'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface ModeToggleProps {
  variant?: 'light' | 'default'
}

export function ModeToggle({ variant = 'default' }: ModeToggleProps) {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            className="rounded-full w-10 h-10 mr-2 bg-transparent border hover:cursor-pointer"
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {resolvedTheme === 'dark' ? (
              <SunIcon
                className={cn(
                  'w-4 h-4',
                  variant === 'light' && 'text-gray-200'
                )}
              />
            ) : (
              <MoonIcon
                className={cn(
                  'w-4 h-4',
                  variant === 'light' && 'text-gray-200'
                )}
              />
            )}
            <span className="sr-only">Switch Theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Switch Theme</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
