import React from 'react'

interface PageHeaderProps {
    title: string
    description?: string
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
    return (
        <div className="space-y-1 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            {description && (
                <p className="text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    )
}
