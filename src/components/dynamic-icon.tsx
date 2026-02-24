import * as Icons from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export type IconName = keyof typeof Icons

export const getIcon = (name: string): LucideIcon | null => {
    const Icon = (Icons as any)[name]
    if (!Icon) return null
    return Icon as LucideIcon
}

export const DynamicIcon = ({ name, ...props }: { name?: string } & Icons.LucideProps) => {
    if (!name) return null
    const Icon = getIcon(name)
    if (!Icon) return null
    return <Icon {...props} />
}
