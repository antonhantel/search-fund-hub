"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent } from "react"

interface FiltersProps {
  industries: string[]
  locations: string[]
  functionAreas: string[]
}

export function Filters({ industries, locations, functionAreas }: FiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''
  const industry = searchParams.get('industry') || ''
  const location = searchParams.get('location') || ''
  const functionArea = searchParams.get('functionArea') || ''

  function handleFilter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const params = new URLSearchParams()

    const searchValue = formData.get('search')
    if (searchValue) params.set('search', searchValue as string)

    const industryValue = formData.get('industry')
    if (industryValue) params.set('industry', industryValue as string)

    const locationValue = formData.get('location')
    if (locationValue) params.set('location', locationValue as string)

    const functionAreaValue = formData.get('functionArea')
    if (functionAreaValue) params.set('functionArea', functionAreaValue as string)

    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ''}`)
  }

  function handleClearFilters() {
    router.push('/jobs')
  }

  return (
    <form onSubmit={handleFilter} className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Job title or keywords"
            defaultValue={search}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <select
            name="industry"
            id="industry"
            defaultValue={industry}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            name="location"
            id="location"
            defaultValue={location}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="functionArea" className="block text-sm font-medium text-gray-700 mb-2">
            Function Area
          </label>
          <select
            name="functionArea"
            id="functionArea"
            defaultValue={functionArea}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Areas</option>
            {functionAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleClearFilters}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 font-medium"
        >
          Clear Filters
        </button>
      </div>
    </form>
  )
}
