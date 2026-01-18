'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

export function ApproveJobButton({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    setLoading(true)
    await fetch('/api/admin/jobs/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId })
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
    >
      {loading ? 'Approving...' : 'Approve'}
    </button>
  )
}

export function RejectJobButton({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleReject = async () => {
    setLoading(true)
    await fetch('/api/admin/jobs/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId })
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleReject}
      disabled={loading}
      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
    >
      {loading ? 'Rejecting...' : 'Reject'}
    </button>
  )
}
