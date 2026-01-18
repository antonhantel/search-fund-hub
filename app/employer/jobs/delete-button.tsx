'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteJobButton({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/employer/jobs/${jobId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/20 rounded-lg text-sm transition-colors disabled:opacity-50"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  )
}
