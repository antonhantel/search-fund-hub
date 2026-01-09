"use client"

export function JobDetailActions() {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => window.print()}
        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
      >
        Print Job Details
      </button>
      <button
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          alert('Link copied to clipboard!')
        }}
        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
      >
        Share Job
      </button>
    </div>
  )
}
