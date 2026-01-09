"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { INDUSTRY_OPTIONS, FUNCTION_AREA_OPTIONS, COMPANY_SIZE_OPTIONS } from "@/lib/constants"

export function JobForm({ employerId }: { employerId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      requirements: formData.get("requirements"),
      languageRequirements: formData.get("languageRequirements"),
      location: formData.get("location"),
      industry: formData.get("industry"),
      functionArea: formData.get("functionArea"),
      companySize: formData.get("companySize"),
      salaryRange: formData.get("salaryRange"),
      status: formData.get("status"),
      employerId,
    }

    try {
      const response = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create job")
      }

      router.push("/employer/jobs")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-900">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            placeholder="e.g., Software Engineer, Business Analyst"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={5}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            placeholder="Describe the role, responsibilities, and what you're looking for in a candidate"
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-900">
            Requirements
          </label>
          <textarea
            name="requirements"
            id="requirements"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            placeholder="List key requirements and qualifications"
          />
        </div>

        <div>
          <label htmlFor="languageRequirements" className="block text-sm font-medium text-gray-900">
            Language Requirements
          </label>
          <input
            type="text"
            name="languageRequirements"
            id="languageRequirements"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            placeholder="e.g., English (native), German (business level)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-900">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
              placeholder="e.g., New York, NY"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-900">
              Industry
            </label>
            <select
              name="industry"
              id="industry"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
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
            <label htmlFor="functionArea" className="block text-sm font-medium text-gray-900">
              Function Area
            </label>
            <select
              name="functionArea"
              id="functionArea"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
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
            <label htmlFor="companySize" className="block text-sm font-medium text-gray-900">
              Company Size
            </label>
            <select
              name="companySize"
              id="companySize"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
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
          <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-900">
            Salary Range
          </label>
          <input
            type="text"
            name="salaryRange"
            id="salaryRange"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            placeholder="e.g., $80,000 - $120,000"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-900">
            Status
          </label>
          <select
            name="status"
            id="status"
            defaultValue="draft"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          >
            <option value="draft">Save as Draft</option>
            <option value="pending">Submit for Review</option>
          </select>
          <p className="mt-2 text-sm text-gray-600">
            Draft jobs are only visible to you. Submit for review to be considered for activation.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  )
}
