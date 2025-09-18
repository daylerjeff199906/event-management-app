'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface SearchResults {
  institution_name: string
  institution_email: string
}

interface InstitutionFoundProps {
  searchResults: SearchResults
  backUrl?: string
  onBack?: () => void
}

export default function InstitutionFound({
  searchResults,
  backUrl = '/',
  onBack
}: InstitutionFoundProps) {
  return (
    <div className="bg-background border rounded-lg p-6 max-w-md mx-auto shadow-sm relative z-20">
      <div className="mb-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
        ) : (
          <Link
            href={onBack ? '#' : backUrl}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        )}
      </div>

      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">
            {searchResults.institution_name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchResults.institution_email}
          </p>
        </div>

        <div className="text-sm text-muted-foreground leading-relaxed">
          Ya existe una cuenta para esta institución. Contacta a soporte para
          más información.
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open('mailto:soporte@tudominio.com')}
        >
          Contactar Soporte
        </Button>
      </div>
    </div>
  )
}
