'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { updateApplicationStage, addApplication, deleteApplication } from './actions'

interface Application {
  id: string
  candidateName: string
  candidateEmail: string
  linkedinUrl: string | null
  resumeUrl: string | null
  coverLetter: string | null
  stage: string
  stageChangedAt: Date
  notes: string | null
  appliedAt: Date
  jobTitle: string
  jobId: string
}

interface Job {
  id: string
  title: string
}

// Updated stages - 4 main columns for desktop kanban
const STAGES = [
  { id: 'screening', label: 'Screen', color: 'bg-blue-500', textColor: 'text-blue-400', borderColor: 'border-blue-500' },
  { id: 'interview', label: 'Interview', color: 'bg-yellow-500', textColor: 'text-yellow-400', borderColor: 'border-yellow-500' },
  { id: 'offer', label: 'Offer', color: 'bg-purple-500', textColor: 'text-purple-400', borderColor: 'border-purple-500' },
  { id: 'rejected', label: 'Reject', color: 'bg-red-500', textColor: 'text-red-400', borderColor: 'border-red-500' },
]

function getTimeInStatus(stageChangedAt: Date): string {
  const now = new Date()
  const changed = new Date(stageChangedAt)
  const diffMs = now.getTime() - changed.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffDays > 0) {
    return `${diffDays}d`
  } else if (diffHours > 0) {
    return `${diffHours}h`
  } else {
    return 'Just now'
  }
}

export default function KanbanBoard({ applications: serverApplications, jobs }: { applications: Application[], jobs: Job[] }) {
  const [applications, setApplications] = useState<Application[]>(serverApplications)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setApplications(serverApplications)
  }, [serverApplications])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const [isPending, startTransition] = useTransition()
  const [selectedStage, setSelectedStage] = useState('screening')
  const [draggedApp, setDraggedApp] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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

  const handleDrop = async (e: React.DragEvent, newStage: string) => {
    e.preventDefault()
    setDragOverStage(null)
    setError(null)

    if (!draggedApp) return

    const app = applications.find(a => a.id === draggedApp)
    if (!app || app.stage === newStage) {
      setDraggedApp(null)
      return
    }

    const appId = draggedApp
    const oldStage = app.stage
    setDraggedApp(null)

    // Optimistic update
    setApplications(prev => prev.map(a =>
      a.id === appId ? { ...a, stage: newStage, stageChangedAt: new Date() } : a
    ))

    setSuccessMessage(`Moved to ${STAGES.find(s => s.id === newStage)?.label}`)
    setTimeout(() => setSuccessMessage(null), 2000)

    try {
      const result = await updateApplicationStage(appId, newStage)
      if (!result.success) {
        throw new Error('Failed to update stage')
      }
    } catch (err) {
      console.error('Failed to update application stage:', err)
      setApplications(prev => prev.map(a =>
        a.id === appId ? { ...a, stage: oldStage } : a
      ))
      setError('Failed to move candidate. Please try again.')
      setTimeout(() => setError(null), 3000)
    }
  }

  const getApplicationsByStage = (stage: string) => {
    return applications.filter(app => {
      const matchesStage = app.stage === stage
      const matchesJob = selectedJobFilter === 'all' || app.jobId === selectedJobFilter
      return matchesStage && matchesJob
    })
  }

  const handleDeleteCandidate = async (applicationId: string) => {
    setShowDeleteConfirm(null)
    setSelectedApp(null)
    setError(null)

    const deletedApp = applications.find(a => a.id === applicationId)
    setApplications(prev => prev.filter(a => a.id !== applicationId))

    try {
      await deleteApplication(applicationId)
    } catch (err) {
      console.error('Failed to delete application:', err)
      if (deletedApp) {
        setApplications(prev => [...prev, deletedApp])
      }
      setError('Failed to delete candidate. Please try again.')
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleViewResume = (resumeUrl: string | null, candidateName: string) => {
    if (!resumeUrl) return

    if (resumeUrl.startsWith('data:')) {
      const win = window.open()
      if (win) {
        win.document.write(`
          <html>
            <head><title>CV - ${candidateName}</title></head>
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

  const handleStageChange = async (appId: string, newStage: string) => {
    const app = applications.find(a => a.id === appId)
    if (!app || app.stage === newStage) return

    const oldStage = app.stage
    setError(null)

    // Update selectedApp to reflect new stage
    setSelectedApp(prev => prev ? { ...prev, stage: newStage, stageChangedAt: new Date() } : null)

    // Optimistic update
    setApplications(prev => prev.map(a =>
      a.id === appId ? { ...a, stage: newStage, stageChangedAt: new Date() } : a
    ))

    setSuccessMessage(`Moved to ${STAGES.find(s => s.id === newStage)?.label}`)
    setTimeout(() => setSuccessMessage(null), 2000)

    try {
      const result = await updateApplicationStage(appId, newStage)
      if (!result.success) {
        throw new Error('Failed to update stage')
      }
    } catch (err) {
      console.error('Failed to update application stage:', err)
      setApplications(prev => prev.map(a =>
        a.id === appId ? { ...a, stage: oldStage } : a
      ))
      setSelectedApp(prev => prev ? { ...prev, stage: oldStage } : null)
      setError('Failed to move candidate. Please try again.')
      setTimeout(() => setError(null), 3000)
    }
  }

  // Mobile: vertical stage selector view
  if (isMobile) {
    const currentStageApps = getApplicationsByStage(selectedStage)
    const currentStage = STAGES.find(s => s.id === selectedStage)

    return (
      <div className="flex flex-col gap-6">
        {/* Job Filter */}
        {jobs.length > 1 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
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

        {/* Stage Navigation */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Pipeline</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>

          <nav className="space-y-2">
            {STAGES.map(stage => {
              const count = getApplicationsByStage(stage.id).length
              const isActive = selectedStage === stage.id

              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    isActive ? `${stage.color} text-white` : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
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
        </div>

        {/* Cards */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-4 h-4 rounded-full ${currentStage?.color}`} />
            <h2 className="text-lg font-semibold text-white">{currentStage?.label}</h2>
            <span className="text-slate-500">({currentStageApps.length})</span>
          </div>

          {currentStageApps.length > 0 ? (
            <div className="space-y-3">
              {currentStageApps.map(app => (
                <CandidateCard
                  key={app.id}
                  app={app}
                  onDragStart={handleDragStart}
                  onClick={() => setSelectedApp(app)}
                  onViewResume={handleViewResume}
                />
              ))}
            </div>
          ) : (
            <EmptyState stage={currentStage?.label || ''} />
          )}
        </div>

        {/* Modals and Notifications */}
        <Notifications error={error} success={successMessage} isPending={isPending} />
        {showAddModal && (
          <AddCandidateModal
            jobs={jobs}
            onClose={() => setShowAddModal(false)}
            onAdd={(newApp) => {
              setShowAddModal(false)
              setApplications(prev => [newApp, ...prev])
            }}
          />
        )}
        {selectedApp && (
          <CandidateDetailModal
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
            onStageChange={(stage) => handleStageChange(selectedApp.id, stage)}
            onViewResume={handleViewResume}
            onDelete={() => setShowDeleteConfirm(selectedApp.id)}
          />
        )}
        {showDeleteConfirm && (
          <DeleteConfirmModal
            onCancel={() => setShowDeleteConfirm(null)}
            onConfirm={() => handleDeleteCandidate(showDeleteConfirm)}
            isPending={isPending}
          />
        )}
      </div>
    )
  }

  // Desktop: Real Kanban Board with 4 columns
  return (
    <div className="flex flex-col gap-6">
      {/* Header with Job Filter and Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Pipeline</h2>
          {jobs.length > 1 && (
            <select
              value={selectedJobFilter}
              onChange={(e) => setSelectedJobFilter(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          )}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Candidate
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-4 gap-4">
        {STAGES.map(stage => {
          const stageApps = getApplicationsByStage(stage.id)
          const isDragOver = dragOverStage === stage.id

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`bg-slate-800/30 border rounded-xl p-4 min-h-[500px] transition-all ${
                isDragOver ? `border-2 ${stage.borderColor} bg-slate-800/50` : 'border-slate-700'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <h3 className="font-semibold text-white">{stage.label}</h3>
                </div>
                <span className="text-sm font-medium text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-full">
                  {stageApps.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {stageApps.map(app => (
                  <CandidateCard
                    key={app.id}
                    app={app}
                    onDragStart={handleDragStart}
                    onClick={() => setSelectedApp(app)}
                    onViewResume={handleViewResume}
                    isDragging={draggedApp === app.id}
                  />
                ))}
                {stageApps.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modals and Notifications */}
      <Notifications error={error} success={successMessage} isPending={isPending} />
      {showAddModal && (
        <AddCandidateModal
          jobs={jobs}
          onClose={() => setShowAddModal(false)}
          onAdd={(newApp) => {
            setShowAddModal(false)
            setApplications(prev => [newApp, ...prev])
          }}
        />
      )}
      {selectedApp && (
        <CandidateDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStageChange={(stage) => handleStageChange(selectedApp.id, stage)}
          onViewResume={handleViewResume}
          onDelete={() => setShowDeleteConfirm(selectedApp.id)}
        />
      )}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => handleDeleteCandidate(showDeleteConfirm)}
          isPending={isPending}
        />
      )}
    </div>
  )
}

function CandidateCard({
  app,
  onDragStart,
  onClick,
  onViewResume,
  isDragging = false
}: {
  app: Application
  onDragStart: (e: React.DragEvent, id: string) => void
  onClick: () => void
  onViewResume: (url: string | null, name: string) => void
  isDragging?: boolean
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, app.id)}
      onClick={onClick}
      className={`bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-slate-600 transition-all ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      {/* Name and Time */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-white truncate">{app.candidateName}</h4>
        <span className="text-xs text-slate-500 whitespace-nowrap" title="Time in current status">
          {getTimeInStatus(app.stageChangedAt)}
        </span>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        {app.resumeUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewResume(app.resumeUrl, app.candidateName)
            }}
            className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
            title="View CV"
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
            className="p-1.5 bg-[#0A66C2]/20 text-[#0A66C2] rounded-lg hover:bg-[#0A66C2]/30 transition-colors"
            title="View LinkedIn"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        )}
      </div>

      {/* Job Title */}
      <div className="mt-2 pt-2 border-t border-slate-700">
        <span className="text-xs text-slate-400 truncate block">{app.jobTitle}</span>
      </div>
    </div>
  )
}

function EmptyState({ stage }: { stage: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-slate-400 mb-1">No candidates in {stage}</h3>
      <p className="text-xs text-slate-500">Drag candidates here or add a new one</p>
    </div>
  )
}

function Notifications({ error, success, isPending }: { error: string | null; success: string | null; isPending: boolean }) {
  return (
    <>
      {isPending && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Saving...
        </div>
      )}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </>
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
  const [isSaving, setIsSaving] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvDataUrl, setCvDataUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    linkedinUrl: '',
    jobId: jobs[0]?.id || '',
    notes: ''
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCvFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setCvDataUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.candidateName || !formData.candidateEmail || !formData.jobId) return

    setIsSaving(true)
    try {
      const result = await addApplication({
        ...formData,
        resumeUrl: cvDataUrl || undefined
      })
      if (result.success && result.application) {
        const job = jobs.find(j => j.id === formData.jobId)
        onAdd({
          ...result.application,
          jobTitle: job?.title || '',
          jobId: formData.jobId,
          appliedAt: new Date(result.application.appliedAt),
          stageChangedAt: new Date(result.application.stageChangedAt || result.application.appliedAt)
        })
      }
    } catch (error) {
      console.error('Failed to add candidate:', error)
    } finally {
      setIsSaving(false)
    }
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
            <label className="block text-sm font-medium text-slate-300 mb-1.5">CV / Resume</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 border-dashed rounded-lg text-slate-400 hover:text-white hover:border-slate-500 transition-colors text-left"
            >
              {cvFile ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {cvFile.name}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload CV (PDF, DOC, DOCX)
                </span>
              )}
            </button>
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
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Adding...' : 'Add Candidate'}
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
            <p className="text-xs text-slate-500 mt-1">
              In current stage: {getTimeInStatus(application.stageChangedAt)}
            </p>
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
                View CV
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

function DeleteConfirmModal({
  onCancel,
  onConfirm,
  isPending
}: {
  onCancel: () => void
  onConfirm: () => void
  isPending: boolean
}) {
  return (
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
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
