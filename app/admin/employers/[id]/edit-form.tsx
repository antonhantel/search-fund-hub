"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { INDUSTRY_OPTIONS } from "@/lib/constants"

interface Employer {
  id: string
  companyName: string
  industry?: string | null
  website?: string | null
  description?: string | null
  status: string
  user: {
    email: string
  }
}

export function EditForm({ employer, jobCount }: { employer: Employer; jobCount: number }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      companyName: formData.get("companyName"),
      industry: formData.get("industry"),
      website: formData.get("website"),
      description: formData.get("description"),
      status: formData.get("status"),
    }

    try {
      const response = await fetch(`/api/admin/employers/${employer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update employer")
      }

      router.push("/admin/employers")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this employer? All associated jobs will also be deleted. This action cannot be undone.")) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/employers/${employer.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete employer")
      }

      router.push("/admin/employers")
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
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {employer.user.email} (Read-only)
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <strong>Jobs Posted:</strong> {jobCount}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            defaultValue={employer.companyName}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-900">
            Industry
          </label>
          <select
            name="industry"
            id="industry"
            defaultValue={employer.industry || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
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
          <label htmlFor="website" className="block text-sm font-medium text-gray-900">
            Website
          </label>
          <input
            type="url"
            name="website"
            id="website"
            defaultValue={employer.website || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            defaultValue={employer.description || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-900">
            Status
          </label>
          <select
            name="status"
            id="status"
            defaultValue={employer.status}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete Employer"}
          </button>
        </div>
      </form>
    </div>
  )
}
