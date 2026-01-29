'use client'

import { useState } from 'react'

const universityClubs = [
  { name: "WHU ETA Club", abbrev: "WHU", logo: "/WHU ETA Club.png" },
  { name: "ETA Sankt Gallen", abbrev: "HSG", logo: "/ETA St Gallen.png" },
  { name: "TU Investment Club", abbrev: "TUM", logo: "/TU Investment Club.png" },
  { name: "Green Finance Consulting", abbrev: "GFC", logo: "/Green Finance Consulting.png" },
  { name: "Integra e.V.", abbrev: "INT", logo: "/Integra e.V..png" },
  { name: "Aachen Investment Club", abbrev: "AIC", logo: "/Aachen Investment Club.png" },
  { name: "HHL Private Equity Club", abbrev: "HHL", logo: "/HHL Private Equity Club.png" },
  { name: "Further partnerships in the pipeline", abbrev: "+", logo: null },
]

function UniversityCard({ club }: { club: typeof universityClubs[0] }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className="bg-white/5 border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group"
    >
      <div className="h-32 flex items-center justify-center mb-4">
        {club.logo && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={club.logo}
            alt={club.name}
            className="h-28 w-auto max-w-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-20 h-20 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
            <span className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">{club.abbrev}</span>
          </div>
        )}
      </div>
      <h4 className="text-base font-semibold text-white line-clamp-2">{club.name}</h4>
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
