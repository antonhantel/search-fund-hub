'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AdminActions() {
  const router = useRouter()
  const [isFixing, setIsFixing] = useState(false)
  const [fixResult, setFixResult] = useState<string | null>(null)

  const handleFixData = async () => {
    if (!confirm('Fix corrupted languageRequirements data in the database?')) return

    setIsFixing(true)
    setFixResult(null)

    try {
      const res = await fetch('/api/admin/fix-data', {
        method: 'POST'
      })

      const data = await res.json()

      if (res.ok) {
        setFixResult(`✅ Success! Fixed ${data.fixedCount} job(s) out of ${data.totalJobs} total jobs.`)
        router.refresh()
      } else {
        setFixResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setFixResult(`❌ Failed to fix data: ${error}`)
    } finally {
      setIsFixing(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Admin Tools</h3>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push('/admin/employers/invite')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
        >
          ➕ Invite New Employer
        </button>

        <button
          onClick={handleFixData}
          disabled={isFixing}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400 font-medium"
        >
          {isFixing ? '🔄 Fixing...' : '🔧 Fix Database Errors'}
        </button>
      </div>

      {fixResult && (
        <div className={`mt-4 p-4 rounded-md ${fixResult.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {fixResult}
        </div>
      )}

      <p className="text-sm text-gray-600">
        Use &quot;Fix Database Errors&quot; if you see JSON parsing errors on the jobs page.
      </p>
    </div>
  )
}
