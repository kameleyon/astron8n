"use client"

import { useState, useRef, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export interface LocationSearchProps {
  onSelect: (location: { name: string; lat: number; lng: number }) => void
  value?: string;
  className?: string;
}

export function LocationSearch({ onSelect, value, className }: LocationSearchProps) {
  const [query, setQuery] = useState(value || '')
  const [results, setResults] = useState<Array<{
    name: string
    lat: number
    lng: number
  }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (value !== undefined) {
      setQuery(value)
    }
  }, [value])

  const searchLocation = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/location?` + 
        new URLSearchParams({
          q: searchQuery
        })
      )

      if (!response.ok) {
        throw new Error('Location search failed')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setResults(data)
      if (data.length === 0) {
        setError('No locations found. Please try a different search term.')
      }
    } catch (error: any) {
      console.error('Error searching location:', error)
      setError(error.message || 'Error searching location. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setQuery(value)
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (value.length >= 3) {
      // Set new timeout for search
      searchTimeoutRef.current = setTimeout(() => {
        searchLocation(value)
      }, 500)
    } else {
      setResults([])
      setError(null)
    }
  }

  const handleSelect = (location: { name: string; lat: number; lng: number }) => {
    onSelect(location)
    setQuery(location.name)
    setResults([])
    setError(null)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResults([])
        setError(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        type="text"
        placeholder="Search for a location..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className={className}
        autoComplete="off"
      />
      
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      )}

      {error && query.length > 0 && (
        <div className="absolute z-10 w-full mt-1">
          <Card className="p-4 text-sm text-red-500 dark:text-red-400 bg-white/95 backdrop-blur-sm">
            {error}
          </Card>
        </div>
      )}

      {!error && results.length > 0 && (
        <Card className="absolute z-10 w-full mt-1 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-200">
          <ul className="py-1 max-h-60 overflow-auto">
            {results.map((result, index) => (
              <li
                key={`${result.name}-${index}`}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                onClick={() => handleSelect(result)}
              >
                {result.name}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
