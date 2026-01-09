"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function DeleteButton({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/employer/jobs/${jobId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete job")
      }

      router.push("/employer/jobs")
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong")
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isLoading}
      className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50 disabled:opacity-50 whitespace-nowrap"
    >
      {isLoading ? "Deleting..." : "Delete"}
    </button>
  )
}
