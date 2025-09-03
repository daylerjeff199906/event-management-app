'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import {
  searchInstitutionSchema,
  type SearchInstitution,
  type InstitutionForm
} from '../../lib/register.institution'
import { searchInstitutionFunction } from '@/services/institution.services'

interface InstitutionSearchProps {
  onInstitutionNotFound: (searchTerm: string) => void
  onInstitutionFound: (institution: InstitutionForm) => void
}

export function InstitutionSearch({
  onInstitutionNotFound,
  onInstitutionFound
}: InstitutionSearchProps) {
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<InstitutionForm | null>(
    null
  )
  const [hasSearched, setHasSearched] = useState(false)

  const form = useForm<SearchInstitution>({
    resolver: zodResolver(searchInstitutionSchema),
    defaultValues: {
      search_term: ''
    }
  })

  const onSubmit = async (query: SearchInstitution) => {
    setIsSearching(true)
    setHasSearched(true)

    try {
      // Simular búsqueda en la base de datos
      // En producción, esto sería una llamada a la API
      const { data, error } = await searchInstitutionFunction(query.search_term)

      if (error) {
        console.error('Error al buscar institución:', error)
        return
      }

      // Simular que no se encontraron resultados para demostrar el flujo
      if (!data) {
        onInstitutionNotFound(query.search_term)
      }

      setSearchResults(data)
    } catch (error) {
      console.error('Error al buscar institución:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Registro Institucional</CardTitle>
        <CardDescription>
          Busca tu institución para verificar si ya está registrada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="search_term"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Nombre de la institución o correo electrónico"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSearching}>
              {isSearching ? 'Buscando...' : 'Buscar Institución'}
            </Button>
          </form>
        </Form>

        {hasSearched && searchResults === null && !isSearching && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            No se encontraron instituciones con ese nombre.
          </div>
        )}

        {searchResults && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium">Instituciones encontradas:</h3>
            <Card
              key={searchResults.id}
              className="cursor-pointer hover:bg-accent"
              onClick={() => onInstitutionFound(searchResults)}
            >
              <CardContent className="p-3">
                <div className="font-medium">
                  {searchResults.institution_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {searchResults.institution_email}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
