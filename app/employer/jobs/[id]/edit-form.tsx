"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { DeleteJobButton } from "../delete-button"
import { INDUSTRY_OPTIONS, FUNCTION_AREA_OPTIONS, COMPANY_SIZE_OPTIONS } from "@/lib/constants"
import { LanguageRequirements } from "@/components/language-requirements"

interface Job {
  id: string
  title: string
  description: string
  requirements?: string | null
  languageRequirements?: string[] | null
  location: string
  industry?: string | null
  functionArea?: string | null
  companySize?: string | null
  salaryRange?: string | null
  status: string
}

export function EditForm({ job }: { job: Job }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    job.languageRequirements || []
  )

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      requirements: formData.get("requirements"),
      languageRequirements: selectedLanguages.length > 0 ? selectedLanguages : null,
      location: formData.get("location"),
      industry: formData.get("industry"),
      functionArea: formData.get("functionArea"),
      companySize: formData.get("companySize"),
      salaryRange: formData.get("salaryRange"),
      status: formData.get("status"),
    }

    try {
      const response = await fetch(`/api/employer/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update job")
      }

      router.push("/employer/jobs")
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
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-200 mb-1">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={job.title}
            required
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-200 mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={5}
            defaultValue={job.description}
            required
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
            defaultValue={job.requirements || ""}
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
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              defaultValue={job.location}
              required
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
              defaultValue={job.industry || ""}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Industry</option>
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
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
              defaultValue={job.functionArea || ""}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Function Area</option>
              {FUNCTION_AREA_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
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
              defaultValue={job.companySize || ""}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Company Size</option>
              {COMPANY_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
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
            defaultValue={job.salaryRange || ""}
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
            defaultValue={job.status}
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Save as Draft</option>
            <option value="pending">Submit for Review</option>
          </select>
          <p className="mt-2 text-sm text-slate-400">
            Draft jobs are only visible to you. Submit for review to be considered for activation.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Job"}
          </button>
          <DeleteJobButton jobId={job.id} />
        </div>
      </form>
    </div>
  )
}
