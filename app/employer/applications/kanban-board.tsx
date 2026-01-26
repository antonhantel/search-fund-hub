'use client'

import { useState, useTransition } from 'react'
import { updateApplicationStage, addApplication, deleteApplication } from './actions'

interface Application {
  id: string
  candidateName: string
  candidateEmail: string
  linkedinUrl: string | null
  resumeUrl: string | null
  coverLetter: string | null
  stage: string
  notes: string | null
  appliedAt: Date
  jobTitle: string
  jobId: string
}

interface Job {
  id: string
  title: string
}

const STAGES = [
  { id: 'new', label: 'New', color: 'bg-slate-500', textColor: 'text-slate-400', activeColor: 'bg-slate-600', borderColor: 'border-slate-500' },
  { id: 'screening', label: 'Screening', color: 'bg-blue-500', textColor: 'text-blue-400', activeColor: 'bg-blue-600', borderColor: 'border-blue-500' },
  { id: 'interview', label: 'Interview', color: 'bg-yellow-500', textColor: 'text-yellow-400', activeColor: 'bg-yellow-600', borderColor: 'border-yellow-500' },
  { id: 'offer', label: 'Offer', color: 'bg-purple-500', textColor: 'text-purple-400', activeColor: 'bg-purple-600', borderColor: 'border-purple-500' },
  { id: 'hired', label: 'Hired', color: 'bg-green-500', textColor: 'text-green-400', activeColor: 'bg-green-600', borderColor: 'border-green-500' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-500', textColor: 'text-red-400', activeColor: 'bg-red-600', borderColor: 'border-red-500' },
]

export default function KanbanBoard({ applications: initialApplications, jobs }: { applications: Application[], jobs: Job[] }) {
  const [applications, setApplications] = useState(initialApplications)
  const [isPending, startTransition] = useTransition()
  const [selectedStage, setSelectedStage] = useState('new')
  const [draggedApp, setDraggedApp] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    setDraggedApp(appId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverStage(stageId)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = (e: React.DragEvent, newStage: string) => {
    e.preventDefault()
    setDragOverStage(null)

    if (!draggedApp) return

    const app = applications.find(a => a.id === draggedApp)
    if (!app || app.stage === newStage) {
      setDraggedApp(null)
      return
    }

    // Optimistic update
    setApplications(prev =>
      prev.map(a => a.id === draggedApp ? { ...a, stage: newStage } : a)
    )

    // Server update
    startTransition(async () => {
      try {
        await updateApplicationStage(draggedApp, newStage)
      } catch (error) {
        // Revert on error
        setApplications(prev =>
          prev.map(a => a.id === draggedApp ? { ...a, stage: app.stage } : a)
        )
        console.error('Failed to update stage:', error)
      }
    })

    setDraggedApp(null)
  }

  const getApplicationsByStage = (stage: string) => {
    return applications.filter(app => {
      const matchesStage = app.stage === stage
      const matchesJob = selectedJobFilter === 'all' || app.jobId === selectedJobFilter
      return matchesStage && matchesJob
    })
  }

  const filteredApplications = selectedJobFilter === 'all'
    ? applications
    : applications.filter(app => app.jobId === selectedJobFilter)

  const handleDeleteCandidate = (applicationId: string) => {
    startTransition(async () => {
      try {
        await deleteApplication(applicationId)
        setApplications(prev => prev.filter(a => a.id !== applicationId))
        setShowDeleteConfirm(null)
        setSelectedApp(null)
      } catch (error) {
        console.error('Failed to delete candidate:', error)
      }
    })
  }

  const currentStageApps = getApplicationsByStage(selectedStage)
  const currentStage = STAGES.find(s => s.id === selectedStage)

  // Function to handle resume viewing
  const handleViewResume = (resumeUrl: string | null, candidateName: string) => {
    if (!resumeUrl) return

    if (resumeUrl.startsWith('data:')) {
      // Open base64 data URL in new tab
      const win = window.open()
      if (win) {
        win.document.write(`
          <html>
            <head><title>Resume - ${candidateName}</title></head>
            <body style="margin:0;height:100vh">
              <embed src="${resumeUrl}" width="100%" height="100%" type="application/pdf" />
            </body>
          </html>
        `)
      }
    } else {
      window.open(resumeUrl, '_blank')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Side - Stage Navigation */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          {/* Job Filter */}
          {jobs.length > 1 && (
            <div className="mb-4 pb-4 border-b border-slate-700">
              <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wide mb-2">Filter by Job</label>
              <select
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Jobs ({applications.length})</option>
                {jobs.map(job => {
                  const count = applications.filter(a => a.jobId === job.id).length
                  return (
                    <option key={job.id} value={job.id}>
                      {job.title} ({count})
                    </option>
                  )
                })}
              </select>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Stages</h3>
            <span className="text-xs text-slate-500">{filteredApplications.length} total</span>
          </div>

          <nav className="space-y-2">
            {STAGES.map(stage => {
              const count = getApplicationsByStage(stage.id).length
              const isActive = selectedStage === stage.id
              const isDragOver = dragOverStage === stage.id

              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? `${stage.activeColor} text-white`
                      : isDragOver
                        ? `bg-slate-700 border-2 ${stage.borderColor} text-white`
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <span className="font-medium">{stage.label}</span>
                  </div>
                  <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Candidate
            </button>
          </div>

          {draggedApp && (
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
              <p className="text-sm text-blue-400">
                Drop on a stage to move
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Cards */}
      <div className="flex-1">
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${currentStage?.color}`} />
              <h2 className="text-xl font-semibold text-white">{currentStage?.label}</h2>
              <span className="text-slate-500">({currentStageApps.length} candidates)</span>
            </div>
          </div>

          {/* Cards Grid */}
          {currentStageApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {currentStageApps.map(app => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app.id)}
                  onClick={() => setSelectedApp(app)}
                  className={`bg-slate-800 border border-slate-700 rounded-xl p-5 cursor-grab active:cursor-grabbing hover:border-slate-600 hover:bg-slate-750 transition-all ${
                    draggedApp === app.id ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{app.candidateName}</h3>
                      <p className="text-sm text-slate-400 truncate">{app.candidateEmail}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {app.resumeUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewResume(app.resumeUrl, app.candidateName)
                          }}
                          className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                          title="View Resume"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                      )}
                      {app.linkedinUrl && (
                        <a
                          href={app.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-[#0A66C2]/20 text-[#0A66C2] rounded-lg hover:bg-[#0A66C2]/30 transition-colors"
                          title="View LinkedIn"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Job Info */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                    <span className="text-xs px-2.5 py-1 bg-slate-700 text-slate-300 rounded-md truncate max-w-[60%]">
                      {app.jobTitle}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-400 mb-1">No candidates in {currentStage?.label}</h3>
              <p className="text-sm text-slate-500">
                Drag candidates here or add a new one
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Loading indicator */}
      {isPending && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Saving...
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddModal && (
        <AddCandidateModal
          jobs={jobs}
          onClose={() => setShowAddModal(false)}
          onAdd={(newApp) => {
            setApplications(prev => [newApp, ...prev])
            setShowAddModal(false)
          }}
        />
      )}

      {/* Candidate Detail Modal */}
      {selectedApp && (
        <CandidateDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStageChange={(newStage) => {
            setApplications(prev =>
              prev.map(a => a.id === selectedApp.id ? { ...a, stage: newStage } : a)
            )
            startTransition(async () => {
              await updateApplicationStage(selectedApp.id, newStage)
            })
          }}
          onViewResume={handleViewResume}
          onDelete={() => setShowDeleteConfirm(selectedApp.id)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Candidate</h3>
                <p className="text-slate-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete this candidate? All their application data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCandidate(showDeleteConfirm)}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AddCandidateModal({
  jobs,
  onClose,
  onAdd
}: {
  jobs: Job[]
  onClose: () => void
  onAdd: (app: Application) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    linkedinUrl: '',
    jobId: jobs[0]?.id || '',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.candidateName || !formData.candidateEmail || !formData.jobId) return

    startTransition(async () => {
      try {
        const result = await addApplication(formData)
        if (result.success && result.application) {
          const job = jobs.find(j => j.id === formData.jobId)
          onAdd({
            ...result.application,
            jobTitle: job?.title || '',
            jobId: formData.jobId,
            appliedAt: new Date(result.application.appliedAt)
          })
        }
      } catch (error) {
        console.error('Failed to add candidate:', error)
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Add Candidate</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Name *</label>
            <input
              type="text"
              required
              value={formData.candidateName}
              onChange={(e) => setFormData(prev => ({ ...prev, candidateName: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email *</label>
            <input
              type="email"
              required
              value={formData.candidateEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, candidateEmail: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Job Position *</label>
            <select
              required
              value={formData.jobId}
              onChange={(e) => setFormData(prev => ({ ...prev, jobId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Initial impressions, source, etc."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isPending ? 'Adding...' : 'Add Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CandidateDetailModal({
  application,
  onClose,
  onStageChange,
  onViewResume,
  onDelete
}: {
  application: Application
  onClose: () => void
  onStageChange: (stage: string) => void
  onViewResume: (url: string | null, name: string) => void
  onDelete: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">{application.candidateName}</h2>
            <p className="text-slate-400">{application.candidateEmail}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            {application.resumeUrl && (
              <button
                onClick={() => onViewResume(application.resumeUrl, application.candidateName)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Resume / CV
              </button>
            )}
            {application.linkedinUrl && (
              <a
                href={application.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                View LinkedIn
              </a>
            )}
          </div>

          {/* Stage Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Pipeline Stage</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {STAGES.map(stage => (
                <button
                  key={stage.id}
                  onClick={() => onStageChange(stage.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    application.stage === stage.id
                      ? `${stage.color} text-white`
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-400 mb-1">Applied For</h4>
              <p className="text-white">{application.jobTitle}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-400 mb-1">Applied On</h4>
              <p className="text-white">
                {new Date(application.appliedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Cover Letter</h4>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-slate-300 whitespace-pre-wrap">{application.coverLetter}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {application.notes && (
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Notes</h4>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-slate-300 whitespace-pre-wrap">{application.notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
