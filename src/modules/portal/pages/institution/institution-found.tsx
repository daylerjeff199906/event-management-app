'use client'

import { Button } from '@/components/ui/button'

interface SearchResults {
  institution_name: string
  institution_email: string
}

interface InstitutionFoundProps {
  searchResults: SearchResults
}

export default function InstitutionFound({
  searchResults
}: InstitutionFoundProps) {
  return (
    <div className="flex flex-col items-center space-y-4 max-w-sm mx-auto text-center">
      <div className="space-y-1">
        <h3 className="font-medium text-foreground">
          {searchResults.institution_name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {searchResults.institution_email}
        </p>
      </div>

      <div className="text-sm text-muted-foreground leading-relaxed">
        Ya existe una cuenta para esta institución. Contacta a soporte para más
        información.
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open('mailto:soporte@tudominio.com')}
      >
        Contactar Soporte
      </Button>
    </div>
  )
}
