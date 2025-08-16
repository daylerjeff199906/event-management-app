import { ChevronLeft } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarToggleProps {
  isOpen: boolean | undefined
  setIsOpen?: () => void
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="invisible lg:visible hidden sm:flex">
      <Button
        onClick={() => setIsOpen?.()}
        className="rounded-md  border border-gray-500 text-gray-500  "
        variant="link"
        size="sm"
      >
        <ChevronLeft
          className={cn(
            'h-5 w-5 transition-transform ease-in-out duration-700',
            isOpen === false ? 'rotate-180' : 'rotate-0'
          )}
        />
      </Button>
    </div>
  )
}
