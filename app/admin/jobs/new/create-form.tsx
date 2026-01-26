"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { INDUSTRY_OPTIONS, FUNCTION_AREA_OPTIONS, COMPANY_SIZE_OPTIONS } from "@/lib/constants"
import { LanguageRequirements } from "@/components/language-requirements"

interface Employer {
  id: string
  companyName: string
}

export function CreateJobForm({ employers }: { employers: Employer[] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      employerId: formData.get("employerId"),
      title: formData.get("title"),
      description: formData.get("description"),
      requirements: formData.get("requirements"),
      languageRequirements: selectedLanguages.length > 0 ? selectedLanguages : null,
      location: formData.get("location"),
      industry: formData.get("industry") || null,
      functionArea: formData.get("functionArea") || null,
      companySize: formData.get("companySize") || null,
      salaryRange: formData.get("salaryRange") || null,
      status: formData.get("status"),
    }

    try {
      const response = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create job")
      }

      router.push("/admin/jobs")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employer Selection */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <label htmlFor="employerId" className="block text-sm font-medium text-blue-300 mb-2">
            Assign to Employer *
          </label>
          <select
            name="employerId"
            id="employerId"
            required
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select an employer</option>
            {employers.map((employer) => (
              <option key={employer.id} value={employer.id}>
                {employer.companyName}
              </option>
            ))}
          </select>
          <p className="text-xs text-blue-400/70 mt-2">
            This job will be linked to the selected employer&apos;s account
          </p>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-200 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            placeholder="e.g., CEO / Managing Director"
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-200 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            id="description"
            rows={5}
            required
            placeholder="Describe the role, responsibilities, and opportunity..."
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-slate-200 mb-1">
            Requirements
          </label>
          <textarea
            name="requirements"
            id="requirements"
            rows={3}
            placeholder="List the key requirements for this role..."
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Language Requirements
          </label>
          <LanguageRequirements
            selected={selectedLanguages}
            onChange={setSelectedLanguages}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-200 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              id="location"
              required
              placeholder="e.g., Munich, Germany"
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-slate-200 mb-1">
              Industry
            </label>
            <select
              name="industry"
              id="industry"
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Industry</option>
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="functionArea" className="block text-sm font-medium text-slate-200 mb-1">
              Function Area
            </label>
            <select
              name="functionArea"
              id="functionArea"
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Function Area</option>
              {FUNCTION_AREA_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="companySize" className="block text-sm font-medium text-slate-200 mb-1">
              Company Size
            </label>
            <select
              name="companySize"
              id="companySize"
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Company Size</option>
              {COMPANY_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="salaryRange" className="block text-sm font-medium text-slate-200 mb-1">
            Salary Range
          </label>
          <input
            type="text"
            name="salaryRange"
            id="salaryRange"
            placeholder="e.g., €80,000 - €120,000"
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-200 mb-1">
            Status
          </label>
          <select
            name="status"
            id="status"
            defaultValue="active"
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
          <p className="text-xs text-slate-400 mt-1">
            Set to &quot;Active&quot; to publish immediately, or &quot;Draft&quot; to save for later
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Job
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
