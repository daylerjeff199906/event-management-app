/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type FilterValue = string | string[] | undefined

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  key: string
  label: string
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange'
  placeholder?: string
  options?: FilterOption[]
  defaultValue?: string | string[]
  searchable?: boolean
}

interface AdvancedFilterProps {
  filters: FilterConfig[]
  onFiltersChange?: (filters: Record<string, FilterValue>) => void
  searchFields?: { key: string; label: string; placeholder?: string }[]
  hiddenMoreFiltersButton?: boolean
  hiddenSearchInput?: boolean
  hiddenBadgeFilters?: boolean
}

export function AdvancedFilterHorizontal({
  filters,
  onFiltersChange,
  searchFields = [],
  hiddenMoreFiltersButton = false,
  hiddenSearchInput = false,
  hiddenBadgeFilters = false
}: AdvancedFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState('')
  const [searchField, setSearchField] = useState(searchFields[0]?.key || '')
  const [activeFilters, setActiveFilters] = useState<
    Record<string, FilterValue>
  >({})
  const clearFilter = useCallback(
    (key: string) => {
      const newFilters = { ...activeFilters }
      delete newFilters[key]
      setActiveFilters(newFilters)
      updateURL(newFilters)
    },
    [activeFilters]
  )

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries()) as Record<
      string,
      string
    >

    const initialFilters: Record<string, FilterValue> = {}

    for (const key of Array.from(searchParams.keys())) {
      const values = searchParams.getAll(key)
      initialFilters[key] = values.length > 1 ? values : values[0]
    }

    const t1 = window.setTimeout(() => {
      setActiveFilters(initialFilters)
    }, 0)

    let t2: number | undefined
    if (searchFields.length > 0) {
      let searchKey = searchField
      let searchVal = ''

      for (const field of searchFields) {
        if (params[field.key]) {
          searchKey = field.key
          searchVal = params[field.key]
          break
        }
      }

      t2 = window.setTimeout(() => {
        setSearchField(searchKey)
        setSearchValue(searchVal)
      }, 0)
    }

    return () => {
      clearTimeout(t1)
      if (t2 !== undefined) clearTimeout(t2)
    }
  }, [searchParams])

  const updateURL = useCallback(
    (newFilters: Record<string, FilterValue>) => {
      const params = new URLSearchParams()

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v))
          } else {
            params.set(key, String(value))
          }
        }
      })

      const queryString = params.toString()
      const newUrl = queryString ? `?${queryString}` : window.location.pathname

      router.replace(newUrl, { scroll: false })
      onFiltersChange?.(newFilters)
    },
    [router, onFiltersChange]
  )

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value)

      const newFilters = { ...activeFilters }

      if (value.trim()) {
        newFilters[searchField] = value
      } else {
        delete newFilters[searchField]
      }

      setActiveFilters(newFilters)
      updateURL(newFilters)
    },
    [activeFilters, searchField, updateURL]
  )

  const handleSearchFieldChange = useCallback(
    (field: string) => {
      const newFilters = { ...activeFilters }

      searchFields.forEach((f) => {
        delete newFilters[f.key]
      })

      if (searchValue.trim()) {
        newFilters[field] = searchValue
      }

      setSearchField(field)
      setActiveFilters(newFilters)
      updateURL(newFilters)
    },
    [activeFilters, searchValue, searchFields, updateURL]
  )

  const handleFilterChange = useCallback(
    (key: string, value: FilterValue) => {
      const newFilters = { ...activeFilters }

      if (value === undefined || value === null || value === '') {
        delete newFilters[key]
      } else {
        newFilters[key] = value
      }

      setActiveFilters(newFilters)
      updateURL(newFilters)
    },
    [activeFilters, updateURL]
  )

  const handleMultiSelectChange = useCallback(
    (key: string, value: string, checked: boolean) => {
      const newFilters = { ...activeFilters }
      const currentValues = Array.isArray(newFilters[key])
        ? (newFilters[key] as string[])
        : []

      if (checked) {
        currentValues.push(value)
      } else {
        const index = currentValues.indexOf(value)
        if (index > -1) {
          currentValues.splice(index, 1)
        }
      }

      if (currentValues.length > 0) {
        newFilters[key] = currentValues
      } else {
        delete newFilters[key]
      }

      setActiveFilters(newFilters)
      updateURL(newFilters)
    },
    [activeFilters, updateURL]
  )

  const clearAllFilters = useCallback(() => {
    setSearchValue('')
    setSearchField(searchFields[0]?.key || '')
    setActiveFilters({})
    updateURL({})
  }, [searchFields, updateURL])

  const activeFilterCount = Object.keys(activeFilters).filter((key) => {
    const value = activeFilters[key]
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== null && value !== ''
  }).length

  return (
    <div className="flex flex-col gap-2 w-fit md:gap-4">
      <div className="flex flex-wrap gap-4 items-center w-full">
        {/* Buscador Principal */}
        {!hiddenSearchInput && (
          <div className="flex gap-2 w-fit md:min-w-[300px] max-w-full">
            <>
              <div className="flex-1 relative rounded-full ">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    searchFields.find((f) => f.key === searchField)
                      ?.placeholder || 'Buscar...'
                  }
                  defaultValue={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>

              {searchFields.length > 1 && (
                <Select
                  value={searchField}
                  onValueChange={handleSearchFieldChange}
                >
                  <SelectTrigger className="w-48 rounded-full">
                    <SelectValue placeholder="Seleccionar campo" />
                  </SelectTrigger>
                  <SelectContent>
                    {searchFields.map((field) => (
                      <SelectItem key={field.key} value={field.key}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </>
          </div>
        )}

        {/* Filtros Activos */}
        {!hiddenMoreFiltersButton && (
          <div className="flex flex-wrap gap-4 items-end">
            {filters.map((filter) => (
              <div key={filter.key} className="flex flex-col gap-2">
                <Label className="text-sm font-semibold">{filter.label}</Label>

                {/* Text Input */}
                {filter.type === 'text' && (
                  <Input
                    placeholder={filter.placeholder}
                    value={String(activeFilters[filter.key] ?? '')}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                    className="rounded-full"
                  />
                )}

                {/* Select */}
                {filter.type === 'select' && filter.options && (
                  <Select
                    value={
                      typeof activeFilters[filter.key] === 'string'
                        ? (activeFilters[filter.key] as string)
                        : filter.defaultValue
                        ? (filter.defaultValue as string)
                        : ''
                    }
                    onValueChange={(value) =>
                      handleFilterChange(filter.key, value)
                    }
                  >
                    <SelectTrigger className="w-full rounded-full">
                      <SelectValue placeholder={filter.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Multi-Select */}
                {filter.type === 'multiselect' && filter.options && (
                  <div className="flex flex-wrap gap-2">
                    {filter.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-2 bg-secondary px-4 py-2 rounded-full cursor-pointer hover:bg-opacity-80 transition-all"
                      >
                        <Checkbox
                          id={`${filter.key}-${option.value}`}
                          checked={
                            Array.isArray(activeFilters[filter.key])
                              ? (
                                  activeFilters[filter.key] as string[]
                                ).includes(option.value)
                              : false
                          }
                          onCheckedChange={(checked) =>
                            handleMultiSelectChange(
                              filter.key,
                              option.value,
                              checked as boolean
                            )
                          }
                        />
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Date */}
                {filter.type === 'date' && (
                  <Input
                    type="date"
                    value={String(activeFilters[filter.key] ?? '')}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                    className="rounded-full"
                  />
                )}

                {/* Date Range */}
                {filter.type === 'daterange' && (
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      placeholder="Desde"
                      value={String(activeFilters[`${filter.key}__gte`] ?? '')}
                      onChange={(e) =>
                        handleFilterChange(`${filter.key}__gte`, e.target.value)
                      }
                      className="rounded-full"
                    />
                    <Input
                      type="date"
                      placeholder="Hasta"
                      value={String(activeFilters[`${filter.key}__lte`] ?? '')}
                      onChange={(e) =>
                        handleFilterChange(`${filter.key}__lte`, e.target.value)
                      }
                      className="rounded-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filtros Activos */}
      <div className="flex items-center justify-start gap-2 flex-wrap w-full">
        <p className="text-xs font-medium text-muted-foreground">
          Filtros Activos: {activeFilterCount}
        </p>
        {!hiddenBadgeFilters && activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => {
              const filterConfig = filters.find((f) => f.key === key)
              const label = filterConfig?.label || key

              // No mostrar filtros vacíos
              if (
                value === undefined ||
                value === null ||
                value === '' ||
                (Array.isArray(value) && value.length === 0)
              ) {
                return null
              }

              if (Array.isArray(value)) {
                return value.map((v) => (
                  <span
                    key={`${key}-${v}`}
                    className="flex items-center gap-2 text-xs font-medium border px-2 py-1 rounded-full bg-secondary"
                  >
                    {label}: {v}
                    <button
                      onClick={() => handleMultiSelectChange(key, v, false)}
                      className="ml-1 hover:text-destructive cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              }

              return (
                <span
                  key={key}
                  className="flex items-center gap-2 text-xs font-medium border px-2 py-1 rounded-full bg-secondary"
                >
                  {label}: {String(value)}
                  <button
                    onClick={() => clearFilter(key)}
                    className="ml-1 hover:text-destructive cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
            })}
          </div>
        )}
        {/* Botón Limpiar Todo */}
        {activeFilterCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent rounded-full text-xs font-medium text-muted-foreground max-h-7"
            onClick={clearAllFilters}
          >
            Limpiar Todo
          </Button>
        )}
      </div>
    </div>
  )
}
