'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'

export default function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [industry, setIndustry] = useState(searchParams.get('industry') || '')
  const [employmentType, setEmploymentType] = useState(searchParams.get('type') || '')

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (location) params.set('location', location)
    if (industry) params.set('industry', industry)
    if (employmentType) params.set('type', employmentType)
    
    const queryString = params.toString()
    router.push(`/jobs${queryString ? '?' + queryString : ''}`)
  }, [search, location, industry, employmentType, router])

  const handleReset = () => {
    setSearch('')
    setLocation('')
    setIndustry('')
    setEmploymentType('')
    router.push('/jobs')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Location */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Industry */}
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Industries</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Retail">Retail</option>
          <option value="Manufacturing">Manufacturing</option>
        </select>

        {/* Employment Type */}
        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="intern">Internship</option>
        </select>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleFilter}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
