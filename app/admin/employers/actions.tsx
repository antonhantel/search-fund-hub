'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

export function ApproveEmployerButton({ employerId }: { employerId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    setLoading(true)
    await fetch('/api/admin/employers/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employerId })
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? 'Approving...' : 'Approve'}
    </button>
  )
}

export function RejectEmployerButton({ employerId }: { employerId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleReject = async () => {
    setLoading(true)
    await fetch('/api/admin/employers/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employerId })
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleReject}
      disabled={loading}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? 'Rejecting...' : 'Reject'}
    </button>
  )
}