'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

interface SearchInputProps {
    placeholder?: string
    className?: string
}

export function SearchInput({ placeholder, className }: SearchInputProps) {
    const { replace } = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }

        startTransition(() => {
            replace(`${pathname}?${params.toString()}`)
        })
    }

    return (
        <div className={`relative flex-1 ${className}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={placeholder || "Buscar..."}
                className="pl-10 h-10 rounded-xl"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()}
            />
            {isPending && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            )}
        </div>
    )
}
