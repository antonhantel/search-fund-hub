'use client'

import { useState, useTransition } from 'react'
import { updateApplicationStage, addApplication } from './actions'

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
  { id: 'new', label: 'New', color: 'bg-slate-500', bgColor: 'bg-slate-50' },
  { id: 'screening', label: 'Screening', color: 'bg-blue-500', bgColor: 'bg-blue-50' },
  { id: 'interview', label: 'Interview', color: 'bg-yellow-500', bgColor: 'bg-yellow-50' },
  { id: 'offer', label: 'Offer', color: 'bg-purple-500', bgColor: 'bg-purple-50' },
  { id: 'hired', label: 'Hired', color: 'bg-green-500', bgColor: 'bg-green-50' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-500', bgColor: 'bg-red-50' },
]

export default function KanbanBoard({ applications: initialApplications, jobs }: { applications: Application[], jobs: Job[] }) {
  const [applications, setApplications] = useState(initialApplications)
  const [isPending, startTransition] = useTransition()
  const [draggedApp, setDraggedApp] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    setDraggedApp(appId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, newStage: string) => {
    e.preventDefault()
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
    return applications.filter(app => app.stage === stage)
  }

  return (
    <div className="relative">
      {/* Add Candidate Button */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-slate-500">
          {applications.length} total candidates
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Candidate
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <div
            key={stage.id}
            className={`flex-shrink-0 w-72 ${stage.bgColor} rounded-xl p-4`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            {/* Stage Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <h3 className="font-semibold text-slate-700">{stage.label}</h3>
              </div>
              <span className="text-sm text-slate-500 bg-white px-2 py-0.5 rounded-full">
                {getApplicationsByStage(stage.id).length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3 min-h-[200px]">
              {getApplicationsByStage(stage.id).map(app => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app.id)}
                  onClick={() => setSelectedApp(app)}
                  className={`bg-white rounded-lg p-4 shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
                    draggedApp === app.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-slate-900 text-sm">
                      {app.candidateName}
                    </h4>
                    {app.linkedinUrl && (
                      <a
                        href={app.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#0A66C2] hover:text-[#004182]"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{app.candidateEmail}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                      {app.jobTitle}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {getApplicationsByStage(stage.id).length === 0 && (
                <div className="text-center py-8 text-sm text-slate-400">
                  Drop candidates here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isPending && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
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
        />
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">Add Candidate</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={formData.candidateName}
              onChange={(e) => setFormData(prev => ({ ...prev, candidateName: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.candidateEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, candidateEmail: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Position *</label>
            <select
              required
              value={formData.jobId}
              onChange={(e) => setFormData(prev => ({ ...prev, jobId: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Initial impressions, source, etc."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
  onStageChange
}: {
  application: Application
  onClose: () => void
  onStageChange: (stage: string) => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{application.candidateName}</h3>
            <p className="text-slate-500">{application.candidateEmail}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Pipeline Stage</label>
            <select
              value={application.stage}
              onChange={(e) => onStageChange(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {STAGES.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm px-3 py-1 bg-slate-100 text-slate-600 rounded-lg">
              📋 {application.jobTitle}
            </span>
            <span className="text-sm px-3 py-1 bg-slate-100 text-slate-600 rounded-lg">
              📅 Applied {new Date(application.appliedAt).toLocaleDateString()}
            </span>
          </div>

          {application.linkedinUrl && (
            <a
              href={application.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white font-medium rounded-lg hover:bg-[#004182] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              View LinkedIn Profile
            </a>
          )}

          {application.coverLetter && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cover Letter</label>
              <p className="text-slate-600 text-sm bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">
                {application.coverLetter}
              </p>
            </div>
          )}

          {application.notes && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
              <p className="text-slate-600 text-sm bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">
                {application.notes}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
