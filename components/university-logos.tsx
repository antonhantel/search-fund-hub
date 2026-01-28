'use client'

import { useState } from 'react'

const universityClubs = [
  { name: "WHU ETA Club", abbrev: "WHU" },
  { name: "ETA Sankt Gallen", abbrev: "HSG" },
  { name: "TU Investment Club", abbrev: "TUM" },
  { name: "Green Finance Consulting", abbrev: "GFC" },
  { name: "Integra e.V.", abbrev: "INT" },
  { name: "Aachen Investment Club", abbrev: "AIC" },
  { name: "HHL Private Equity Club", abbrev: "HHL" },
  { name: "Further partnerships in the pipeline", abbrev: "+" },
]

function UniversityCard({ club }: { club: typeof universityClubs[0] }) {
  const [imgError, setImgError] = useState(true) // Default to true to show placeholder

  return (
    <div
      className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group"
    >
      <div className="h-12 flex items-center justify-center mb-3">
        {!imgError ? (
          // Placeholder for future club logo
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src=""
            alt={club.abbrev}
            className="h-10 w-auto max-w-full object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
            <span className="text-lg font-bold text-blue-400 group-hover:text-blue-300 transition-colors">{club.abbrev}</span>
          </div>
        )}
      </div>
      <h4 className="text-sm font-semibold text-white line-clamp-2">{club.name}</h4>
    </div>
  )
}

export function UniversityLogos() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {universityClubs.map((club, index) => (
        <UniversityCard key={index} club={club} />
      ))}
    </div>
  )
}
