import type React from 'react'
import Link from 'next/link'
import { ArrowRight, LucideIcon } from 'lucide-react'
import { LucideIconName } from '@/types'
import { createElement } from 'react'
import * as LucideIcons from 'lucide-react'

interface MetricCardProps {
  value: string
  label: string
  sublabel: string
  icon: LucideIconName
  iconBg: string
  href: string
}

export function MetricCard({
  value,
  label,
  sublabel,
  icon,
  iconBg,
  href
}: MetricCardProps) {
  type LucideIconName = keyof typeof LucideIcons
  const iconMap = LucideIcons

  function getIconComponent(iconName: LucideIconName): LucideIcon {
    return iconMap[iconName] as LucideIcon
  }
  return (
    <Link href={href}>
      <div className="bg-gray-100 border border-border rounded-lg px-3 py-4 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        {/* Header con icono */}
        <div className="flex items-center gap-4 border border-border p-2 py-3 mb-4 rounded-lg bg-white">
          <div
            className={`${iconBg} p-3 rounded-lg flex items-center justify-center w-fit `}
          >
            {createElement(getIconComponent(icon as LucideIconName), {
              className: 'h-5 w-5 text-white'
            })}
          </div>
          {/* Valor grande */}
          <div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{sublabel}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-foreground">{label}</p>
          <ArrowRight className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
        </div>
      </div>
    </Link>
  )
}
