"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { INDUSTRY_OPTIONS } from "@/lib/constants"

interface Employer {
  id: string
  companyName: string
  industry?: string | null
  website?: string | null
  linkedinUrl?: string | null
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
      linkedinUrl: formData.get("linkedinUrl"),
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
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <p className="text-sm text-slate-300">
            <strong className="text-white">Email:</strong> {employer.user.email} (Read-only)
          </p>
          <p className="text-sm text-slate-300 mt-1">
            <strong className="text-white">Jobs Posted:</strong> {jobCount}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-slate-300 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              id="companyName"
              defaultValue={employer.companyName}
              required
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-1">
              Industry
            </label>
            <select
              name="industry"
              id="industry"
              defaultValue={employer.industry || ""}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-slate-300 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              id="website"
              defaultValue={employer.website || ""}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="linkedinUrl" className="block text-sm font-medium text-slate-300 mb-1">
              LinkedIn URL
            </label>
            <input
              type="url"
              name="linkedinUrl"
              id="linkedinUrl"
              defaultValue={employer.linkedinUrl || ""}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            defaultValue={employer.description || ""}
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">
            Status
          </label>
          <select
            name="status"
            id="status"
            defaultValue={employer.status}
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-6 py-3 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/20 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </form>
    </div>
  )
}
