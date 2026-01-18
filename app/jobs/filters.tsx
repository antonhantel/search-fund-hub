'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'

interface FiltersProps {
  industries?: string[]
  locations?: string[]
  functionAreas?: string[]
}

export default function Filters({ industries = [], locations = [], functionAreas = [] }: FiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [industry, setIndustry] = useState(searchParams.get('industry') || '')
  const [functionArea, setFunctionArea] = useState(searchParams.get('functionArea') || '')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (location) params.set('location', location)
    if (industry) params.set('industry', industry)
    if (functionArea) params.set('functionArea', functionArea)
    
    const queryString = params.toString()
    router.push(`/jobs${queryString ? '?' + queryString : ''}`)
  }, [search, location, industry, functionArea, router])

  const handleReset = () => {
    setSearch('')
    setLocation('')
    setIndustry('')
    setFunctionArea('')
    router.push('/jobs')
  }

  const hasActiveFilters = search || location || industry || functionArea

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 md:p-6 mb-6">
      {/* Mobile: Collapsible header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🔍</span>
          <span className="font-semibold text-white">Search & Filter</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        <svg 
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Desktop: Always visible header */}
      <h3 className="hidden md:block text-lg font-semibold text-white mb-4">Search & Filter</h3>
      
      {/* Filter form */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
              className="w-full px-4 py-2.5 pl-10 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Location */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Industry */}
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="">All Industries</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          {/* Function Area */}
          <select
            value={functionArea}
            onChange={(e) => setFunctionArea(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="">All Functions</option>
            {functionAreas.map(func => (
              <option key={func} value={func}>{func}</option>
            ))}
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4">
          <button
            onClick={handleFilter}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            Apply Filters
          </button>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
